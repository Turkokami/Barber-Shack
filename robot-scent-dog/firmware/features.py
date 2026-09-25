"""Turn one sniff (purge -> sniff -> hold rows) into a feature vector.

Shared by train_classifier.py and detector.py so training and live use match exactly.
"""

import numpy as np
import pandas as pd

GAS_CHANNELS = [
    "bme_a_gas", "bme_b_gas", "sgp_voc_raw", "sgp_nox_raw",
    "tgs2602_rs", "tgs2620_rs", "pid_v",
]
BASELINE_SECONDS = 5.0  # the end of PURGE is used as the clean-air baseline
_trapz = getattr(np, "trapezoid", None) or np.trapz


def sniff_features(rows: pd.DataFrame) -> dict:
    """rows: every logged row for one sniff_id (columns from sniff_logger.py)."""
    purge = rows[rows.phase == "purge"]
    base = purge[purge.t_phase >= purge.t_phase.max() - BASELINE_SECONDS]
    resp = rows[rows.phase.isin(["sniff", "hold"])]
    if base.empty or resp.empty:
        raise ValueError("sniff is missing a purge or response phase")

    feats = {}
    t = resp.t_sniff.to_numpy()
    for ch in GAS_CHANNELS:
        x0 = float(base[ch].mean())
        if abs(x0) < 1e-9:
            x0 = 1e-9
        rel = (resp[ch].to_numpy(dtype=float) - x0) / abs(x0)
        i_ext = int(np.argmax(np.abs(rel)))
        feats[f"{ch}_min"] = rel.min()
        feats[f"{ch}_max"] = rel.max()
        feats[f"{ch}_end"] = rel[-1]
        feats[f"{ch}_auc"] = _trapz(rel, t) if len(t) > 1 else 0.0
        feats[f"{ch}_t_ext"] = t[i_ext] - t[0]
        feats[f"{ch}_slope0"] = np.polyfit(t[:4] - t[0], rel[:4], 1)[0] if len(t) >= 4 else 0.0

    # Ratios between sensors are the "fingerprint": e.g. hexenal/octenal vs. sulfur channels.
    for a, b in [("bme_a_gas", "bme_b_gas"), ("tgs2602_rs", "tgs2620_rs"), ("bme_a_gas", "tgs2602_rs")]:
        feats[f"ratio_{a}_{b}"] = feats[f"{a}_min"] - feats[f"{b}_min"]

    # Context features let the model learn humidity/temperature drift.
    feats["base_rh"] = float(base.chamber_rh.mean())
    feats["base_t"] = float(base.chamber_t.mean())
    feats["d_rh"] = float(resp.chamber_rh.max() - base.chamber_rh.mean())
    return feats


def dataset(df: pd.DataFrame) -> pd.DataFrame:
    """One row per sniff with features + label/session/station metadata."""
    out = []
    for sniff_id, rows in df.groupby("sniff_id"):
        try:
            f = sniff_features(rows)
        except ValueError:
            continue
        f.update(sniff_id=sniff_id, label=rows.label.iloc[0],
                 session=rows.session.iloc[0], station=rows.station.iloc[0])
        out.append(f)
    return pd.DataFrame(out)
