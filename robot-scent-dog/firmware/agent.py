"""Unit agent: turns one robot dog + nose into a unit the Robo-K9 Hub can give duties to.

Runs on the nose's Raspberry Pi 5. It:
  * registers with the hub, and sends a heartbeat (state, battery, pose) every 5 s
  * asks the hub for its next task and carries it out (patrol / recheck / confirm / calibrate)
  * reports every sniff, every alert, and a summary when the task ends
  * obeys hub commands from the heartbeat reply: stop, sit, stand, return_home, abort_task

Examples:
    # Go2 Pro over Wi-Fi (go2_ros2_sdk + Nav2 already running)
    python agent.py --hub http://192.168.8.10:8080 --key $HUB_KEY --unit-id k9-01 --robot webrtc \
        --model model.joblib --stations stations.json
    # Go2 EDU over Ethernet
    python agent.py ... --robot sdk2
    # Handheld wand unit (a person does confirm and calibrate tasks)
    python agent.py ... --unit-id wand-01 --robot wand --caps confirm,nose
    # Full simulation, no hardware: a fake bed bug hot spot at (2.0, 1.0)
    python agent.py --hub http://localhost:8080 --key change-me --unit-id sim-01 --robot sim \
        --nose sim --sim-hotspot 2.0,1.0 --stations stations.example.json

stations.json maps a room to its sniff stations, [x, y, yaw] in map coordinates:
    {"home": [0, 0, 0], "204": [[0.5, 0.4, 0.0], [0.9, 0.4, 0.0], ...]}
Generate them from the saved map (BUILD_PLAN.md, Phase 2, "station generator"), or give them
directly in the task params as {"stations": [...]}.
"""

import argparse
import json
import math
import random
import threading
import time
import urllib.request

SNIFFS_PER_STATION = 3
CONFIRM_SNIFFS = 5
CONFIRM_MIN_HITS = 2
CONSECUTIVE_TO_ALERT = 2
HEARTBEAT_S = 5.0


class Hub:
    def __init__(self, url, key):
        self.url, self.key = url.rstrip("/"), key

    def post(self, path, body=None):
        req = urllib.request.Request(self.url + path, data=json.dumps(body or {}).encode(), method="POST",
                                     headers={"Content-Type": "application/json", "X-Hub-Key": self.key})
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())


class SimNose:
    """Fake nose: P(bed bug) is high within ~0.6 m of the hot spot, low elsewhere."""

    threshold = 0.5

    def __init__(self, robot, hotspot=None):
        self.robot, self.hotspot = robot, hotspot

    def sniff(self):
        time.sleep(0.05)
        if self.hotspot:
            p = self.robot.pose()
            d = math.dist((p.get("x", 0), p.get("y", 0)), self.hotspot)
            if d < 0.6:
                return min(1.0, 0.75 + random.random() * 0.2)
        return random.random() * 0.2


class Aborted(Exception):
    pass


class Agent:
    def __init__(self, args):
        from robot import make_robot, SimRobot
        self.hub = Hub(args.hub, args.key)
        self.unit_id = args.unit_id
        self.caps = args.caps.split(",")
        self.robot = SimRobot() if args.robot == "wand" else make_robot(args.robot)
        self.is_wand = args.robot == "wand"
        if args.nose == "sim":
            hs = tuple(map(float, args.sim_hotspot.split(","))) if args.sim_hotspot else None
            self.nose = SimNose(self.robot, hs)
        else:
            from detector import NoseScorer
            self.nose = NoseScorer(args.model)
        self.stations = json.load(open(args.stations)) if args.stations else {}
        self.state, self.task, self.abort = "idle", None, threading.Event()
        self.hub.post("/api/units/register", {"unit_id": self.unit_id, "name": args.name or self.unit_id,
                                              "robot_model": args.robot_model, "capabilities": self.caps})
        threading.Thread(target=self._heartbeat_loop, daemon=True).start()

    # --- hub link --------------------------------------------------------------
    def _heartbeat_loop(self):
        while True:
            try:
                r = self.hub.post(f"/api/units/{self.unit_id}/heartbeat", {
                    "state": self.state, "battery": self.robot.battery(), "pose": self.robot.pose(),
                    "current_task": self.task["task_id"] if self.task else None})
                if r.get("command"):
                    self._command(r["command"])
            except Exception as e:  # keep going through Wi-Fi drop-outs
                print(f"[agent] heartbeat failed: {e}")
            time.sleep(HEARTBEAT_S)

    def _command(self, cmd):
        kind = cmd.get("type")
        print(f"[agent] hub command: {kind}")
        if kind in ("stop", "abort_task"):
            self.abort.set()
            self.robot.stop()
            if kind == "stop":
                self.state = "stopped"
        elif kind == "sit":
            self.robot.sit()
        elif kind == "stand":
            self.robot.stand()
            if self.state == "stopped":
                self.state = "idle"
        elif kind == "return_home":
            self.abort.set()
            home = self.stations.get("home")
            if home:
                threading.Thread(target=self.robot.go_to, args=home, daemon=True).start()

    def event(self, type_, **data):
        try:
            return self.hub.post(f"/api/tasks/{self.task['task_id']}/events",
                                 {"unit_id": self.unit_id, "type": type_, "data": data})
        except Exception as e:
            print(f"[agent] event {type_} not delivered: {e}")

    def check(self):
        if self.abort.is_set():
            raise Aborted()

    # --- duties ------------------------------------------------------------------
    def run_forever(self):
        while True:
            if self.state == "stopped":
                time.sleep(1)
                continue
            try:
                t = self.hub.post(f"/api/units/{self.unit_id}/next-task")["task"]
            except Exception as e:
                print(f"[agent] hub unreachable: {e}")
                t = None
            if not t:
                time.sleep(HEARTBEAT_S)
                continue
            self.task, self.state = t, "busy"
            self.abort.clear()
            print(f"[agent] task {t['task_id']}: {t['kind']} {t['site']}/{t['room']}")
            try:
                summary = getattr(self, "do_" + t["kind"])(t)
                self.event("done", **summary)
            except Aborted:
                self.event("failed", reason="aborted by hub")
            except Exception as e:
                self.robot.stop()
                self.event("failed", reason=repr(e))
            self.task = None
            if self.state == "busy":
                self.state = "idle"

    def _stations_for(self, t):
        st = t["params"].get("stations") or self.stations.get(t["room"])
        if not st:
            raise RuntimeError(f"no sniff stations for room {t['room']!r}")
        return st

    def do_patrol(self, t):
        thr = self.nose.threshold
        sniffs = alerts = 0
        max_p = 0.0
        for i, (x, y, yaw) in enumerate(self._stations_for(t)):
            self.check()
            self.event("progress", station=i, of=len(self._stations_for(t)))
            if not self.robot.go_to(x, y, yaw):
                self.event("progress", station=i, note="unreachable, skipped")
                continue
            self.robot.sniff_posture()
            hits = 0
            for _ in range(SNIFFS_PER_STATION):
                self.check()
                p = self.nose.sniff()
                sniffs += 1
                max_p = max(max_p, p)
                self.event("sniff", station=i, p_bedbug=round(p, 3), pose=self.robot.pose())
                hits = hits + 1 if p > thr else 0
                if hits >= CONSECUTIVE_TO_ALERT:
                    alerts += 1
                    self.robot.sit()  # the alert, like a trained dog
                    self.event("alert", station=i, p_bedbug=round(p, 3), pose=self.robot.pose())
                    time.sleep(3)
                    self.robot.stand()
                    break
            self.robot.normal_posture()
        return {"stations": len(self._stations_for(t)), "sniffs": sniffs, "alerts": alerts, "max_p": round(max_p, 3)}

    do_recheck = do_patrol

    def do_confirm(self, t):
        loc = t["params"].get("location") or {}
        if self.is_wand:
            print(f"[agent] CONFIRM at room {t['room']} station {t['params'].get('station')}: "
                  f"probe seams within {t['params'].get('radius_m', 0.5)} m; each button press = one sniff")
            if loc:  # the handler walks there; record the spot so reports show where they sniffed
                self.robot.go_to(loc.get("x", 0), loc.get("y", 0), loc.get("yaw", 0))
        elif loc:
            self.robot.go_to(loc.get("x", 0), loc.get("y", 0), loc.get("yaw", 0))
            self.robot.sniff_posture()
        ps = []
        for _ in range(CONFIRM_SNIFFS):
            self.check()
            if self.is_wand and hasattr(self.nose, "nose"):
                self.nose.nose.button.wait_for_press()
            p = self.nose.sniff()
            ps.append(round(p, 3))
            self.event("sniff", station=t["params"].get("station"), p_bedbug=round(p, 3), pose=self.robot.pose())
        self.robot.normal_posture()
        hits = sum(p > self.nose.threshold for p in ps)
        confirmed = hits >= CONFIRM_MIN_HITS
        if confirmed and not self.is_wand:
            self.robot.sit()
        return {"confirmed": confirmed, "hits": hits, "p_values": ps}

    def do_calibrate(self, t):
        print("[agent] CALIBRATE: present the reference vial at the snout for sniffs 1-3, then a blank for 4-6")
        ps = []
        for _ in range(6):
            self.check()
            ps.append(round(self.nose.sniff(), 3))
        ref, blank = ps[:3], ps[3:]
        ok = min(ref) > self.nose.threshold and max(blank) < self.nose.threshold
        return {"reference": ref, "blank": blank, "pass": ok}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--hub", required=True)
    ap.add_argument("--key", required=True)
    ap.add_argument("--unit-id", required=True)
    ap.add_argument("--name", default="")
    ap.add_argument("--robot", choices=["webrtc", "sdk2", "sim", "wand"], default="webrtc")
    ap.add_argument("--robot-model", default="Unitree Go2 Pro")
    ap.add_argument("--caps", default="patrol,confirm,nose")
    ap.add_argument("--nose", choices=["real", "sim"], default="real")
    ap.add_argument("--model", default="model.joblib")
    ap.add_argument("--stations", default="")
    ap.add_argument("--sim-hotspot", default="")
    Agent(ap.parse_args()).run_forever()


if __name__ == "__main__":
    main()
