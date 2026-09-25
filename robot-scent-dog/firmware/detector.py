"""Live detection: sniff, score, alert. Optionally publishes to ROS 2 for the robot.

    python detector.py --model model.joblib            # continuous sniffing
    python detector.py --model model.joblib --wand     # one sniff per button press
    python detector.py --model model.joblib --ros      # also publish /nose/p_bedbug and /nose/alert

The robot's mission node subscribes to /nose/alert. On True it stops, calls the Go2 sport-mode
Sit, and drops a map pin (see BUILD_PLAN.md, Phase 2).
"""

import argparse
import time

import joblib
import pandas as pd

from features import sniff_features
from nose import Nose
from sniff_logger import run_sniff

CONSECUTIVE_TO_ALERT = 2


class RosBridge:
    def __init__(self):
        import rclpy
        from std_msgs.msg import Bool, Float32
        rclpy.init()
        self._rclpy, self._Bool, self._Float32 = rclpy, Bool, Float32
        self.node = rclpy.create_node("robo_k9_nose")
        self.p_pub = self.node.create_publisher(Float32, "/nose/p_bedbug", 10)
        self.a_pub = self.node.create_publisher(Bool, "/nose/alert", 10)

    def publish(self, p: float, alert: bool):
        self.p_pub.publish(self._Float32(data=float(p)))
        self.a_pub.publish(self._Bool(data=bool(alert)))
        self._rclpy.spin_once(self.node, timeout_sec=0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="model.joblib")
    ap.add_argument("--wand", action="store_true")
    ap.add_argument("--ros", action="store_true")
    args = ap.parse_args()

    bundle = joblib.load(args.model)
    model, cols, thr = bundle["model"], bundle["features"], bundle["threshold"]
    ros = RosBridge() if args.ros else None

    nose = Nose()
    nose.set_pump(1.0)
    nose.condition()
    hits = 0
    n = 0
    try:
        while True:
            if args.wand:
                print("Press the wand button to sniff...")
                nose.button.wait_for_press()
            rows = []
            run_sniff(nose, rows.append, sniff_id=f"live-{n:05d}")
            n += 1
            feats = pd.DataFrame([sniff_features(pd.DataFrame(rows))]).reindex(columns=cols, fill_value=0.0)
            p = float(model.predict_proba(feats)[0, 1])
            # In wand mode each press is a separate spot, so one hit is enough to alert.
            hits = hits + 1 if p > thr else 0
            alert = hits >= (1 if args.wand else CONSECUTIVE_TO_ALERT)
            print(f"{time.strftime('%H:%M:%S')}  P(bed bug) = {p:.2f}  {'*** ALERT ***' if alert else ''}")
            if alert:
                nose.led.on()
                for _ in range(3):
                    nose.beep(0.2)
                    time.sleep(0.1)
            else:
                nose.led.off()
            if ros:
                ros.publish(p, alert)
    except KeyboardInterrupt:
        pass
    finally:
        nose.safe()


if __name__ == "__main__":
    main()
