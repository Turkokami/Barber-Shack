"""Run purge -> sniff -> hold cycles and log every sensor reading to CSV.

Examples:
    # 20 sniffs of a live-bug vial held 5 cm from the snout
    python sniff_logger.py --label bedbug_live --station bench5cm --sniffs 20
    # blanks and confounders, same way
    python sniff_logger.py --label blank --sniffs 30
    python sniff_logger.py --label confounder_cut_grass --sniffs 10
    # wand mode: one sniff per button press
    python sniff_logger.py --label unknown --station wand --wand
"""

import argparse
import csv
import os
import time
import uuid
from datetime import datetime

from nose import Nose

PURGE_S, SNIFF_S, HOLD_S = 20.0, 5.0, 10.0
SAMPLE_HZ = 2.0

PHASES = [  # name, seconds, path, pump duty
    ("purge", PURGE_S, "clean", 1.0),
    ("sniff", SNIFF_S, "sample", 1.0),
    ("hold", HOLD_S, "clean", 0.0),
]


def run_sniff(nose: Nose, on_row, sniff_id: str):
    """One full cycle. on_row(dict) is called for every reading."""
    t_start = time.monotonic()
    t_sniff0 = None
    for name, seconds, path, duty in PHASES:
        nose.set_path(path)
        nose.set_pump(duty)
        t_phase0 = time.monotonic()
        if name == "sniff":
            t_sniff0 = t_phase0
        while (now := time.monotonic()) - t_phase0 < seconds:
            row = nose.read()
            row.update(
                sniff_id=sniff_id,
                phase=name,
                t_phase=round(now - t_phase0, 3),
                t_cycle=round(now - t_start, 3),
                t_sniff=round(now - t_sniff0, 3) if t_sniff0 else None,
            )
            on_row(row)
            time.sleep(max(0.0, 1.0 / SAMPLE_HZ - (time.monotonic() - now)))
    nose.set_path("clean")
    nose.set_pump(1.0)  # keep purging between sniffs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--label", required=True, help="bedbug_live, bedbug_pseudo, blank, confounder_<name>, unknown")
    ap.add_argument("--station", default="bench")
    ap.add_argument("--sniffs", type=int, default=10)
    ap.add_argument("--wand", action="store_true", help="wait for the wand button before each sniff")
    ap.add_argument("--out", default="data")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    session = datetime.now().strftime("%Y%m%d-%H%M%S") + "-" + uuid.uuid4().hex[:4]
    path = os.path.join(args.out, f"{session}_{args.label}.csv")

    nose = Nose()
    print("Conditioning SGP41 and purging (10 s)...")
    nose.set_pump(1.0)
    nose.condition()

    writer = None
    with open(path, "w", newline="") as f:
        def on_row(row):
            nonlocal writer
            row.update(timestamp=time.time(), session=session, label=args.label, station=args.station)
            if writer is None:
                writer = csv.DictWriter(f, fieldnames=list(row.keys()))
                writer.writeheader()
            writer.writerow(row)

        try:
            for i in range(args.sniffs):
                if args.wand:
                    print("Press the wand button to sniff...")
                    nose.button.wait_for_press()
                sniff_id = f"{session}-{i:03d}"
                print(f"[{i + 1}/{args.sniffs}] {sniff_id}")
                nose.led.on()
                run_sniff(nose, on_row, sniff_id)
                nose.led.off()
                f.flush()
        finally:
            nose.safe()
    print(f"Saved {path}")


if __name__ == "__main__":
    main()
