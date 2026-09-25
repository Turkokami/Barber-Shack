"""Train the bed-bug vs. everything-else classifier from sniff_logger.py CSVs.

    python train_classifier.py data/*.csv --out model.joblib

Cross-validation is grouped by session, so every sniff from one session is either all in
training or all in testing. Without this, the model can "memorise the day's air" and the
scores look better than they really are.
"""

import argparse

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, roc_auc_score
from sklearn.model_selection import GroupKFold

from features import dataset

POSITIVE_PREFIX = "bedbug"
META = ["sniff_id", "label", "session", "station"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv", nargs="+")
    ap.add_argument("--out", default="model.joblib")
    ap.add_argument("--target-fpr", type=float, default=0.10, help="pick the threshold for this false-positive rate")
    args = ap.parse_args()

    raw = pd.concat([pd.read_csv(p) for p in args.csv], ignore_index=True)
    ds = dataset(raw)
    y = ds.label.str.startswith(POSITIVE_PREFIX).astype(int).to_numpy()
    X = ds.drop(columns=META).fillna(0.0)
    groups = ds.session.to_numpy()
    print(f"{len(ds)} sniffs, {y.sum()} positive, {len(set(groups))} sessions")
    print(ds.label.value_counts().to_string(), "\n")

    n_splits = min(5, len(set(groups)))
    if n_splits < 2:
        raise SystemExit("Need at least 2 sessions for cross-validation.")

    oof = np.zeros(len(y))
    for fold, (tr, te) in enumerate(GroupKFold(n_splits=n_splits).split(X, y, groups)):
        clf = RandomForestClassifier(n_estimators=400, min_samples_leaf=2,
                                     class_weight="balanced", random_state=fold)
        clf.fit(X.iloc[tr], y[tr])
        oof[te] = clf.predict_proba(X.iloc[te])[:, 1]

    if len(set(y)) == 2:
        print(f"Grouped CV ROC-AUC: {roc_auc_score(y, oof):.3f}")
    # Best sensitivity with FPR <= target; on ties take the highest threshold (fewest false alerts).
    best = (-1.0, 0.5)
    for cand in np.unique(np.concatenate([[0.0], oof])):
        p = oof > cand
        fpr = (p & (y == 0)).sum() / max((y == 0).sum(), 1)
        sens = (p & (y == 1)).sum() / max((y == 1).sum(), 1)
        if fpr <= args.target_fpr and (sens, cand) > best:
            best = (sens, float(cand))
    thr = best[1]
    pred = (oof > thr).astype(int)
    tn, fp, fn, tp = confusion_matrix(y, pred, labels=[0, 1]).ravel()
    print(f"Threshold {thr:.3f}: sensitivity {tp / max(tp + fn, 1):.2%}, "
          f"false-positive rate {fp / max(fp + tn, 1):.2%}  (TP {tp} FN {fn} FP {fp} TN {tn})")

    # Which negatives fool it? This tells you what data to collect next.
    fooled = ds.assign(p=oof)[(y == 0) & (pred == 1)].label.value_counts()
    if not fooled.empty:
        print("\nFalse positives by label:\n" + fooled.to_string())

    final = RandomForestClassifier(n_estimators=400, min_samples_leaf=2,
                                   class_weight="balanced", random_state=0).fit(X, y)
    top = pd.Series(final.feature_importances_, index=X.columns).nlargest(10)
    print("\nTop features:\n" + top.round(4).to_string())

    joblib.dump({"model": final, "features": list(X.columns), "threshold": thr}, args.out)
    print(f"\nSaved {args.out}")


if __name__ == "__main__":
    main()
