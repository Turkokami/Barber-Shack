"""Robot adapters: one interface, three backends.

    Go2WebRtc  Go2 Air/Pro (or EDU) over Wi-Fi, via the community go2_ros2_sdk (ROS 2)
    Go2Sdk2    Go2 EDU over Ethernet, via Unitree's official unitree_sdk2_python
    SimRobot   no robot: prints what it would do (bench tests, CI, demos)

Navigation uses Nav2 (nav2_simple_commander) on the map made with slam_toolbox, for both Go2
backends. Posture commands (sit, stand, pitch nose-down, stop) go through each backend's own API.

Sport-mode API ids below come from go2_ros2_sdk / Unitree's sport API. Check them against the
firmware and SDK versions you install. Unitree has changed them between releases before.
"""

import json
import math
import time

SPORT_API = {  # Unitree Go2 sport-mode request ids
    "BalanceStand": 1002,
    "StopMove": 1003,
    "StandUp": 1004,
    "Euler": 1007,
    "Sit": 1009,
    "RiseSit": 1010,
}
SNIFF_PITCH_RAD = 0.30  # nose-down pitch at a sniff station (~17 degrees)


class Robot:
    """Interface that agent.py uses."""

    def go_to(self, x: float, y: float, yaw: float, timeout_s: float = 120) -> bool: ...
    def sniff_posture(self): ...        # stop, pitch the body nose-down
    def normal_posture(self): ...
    def sit(self): ...                  # the alert
    def stand(self): ...
    def stop(self): ...                 # cancel navigation + StopMove
    def pose(self) -> dict: ...
    def battery(self) -> float | None: ...


class _Nav2Mixin:
    """Nav2 goals + TF pose. Needs ROS 2 + nav2_simple_commander on the Pi."""

    def _init_nav(self):
        import rclpy
        from nav2_simple_commander.robot_navigator import BasicNavigator
        if not rclpy.ok():
            rclpy.init()
        self.nav = BasicNavigator()
        self.nav.waitUntilNav2Active()

    def go_to(self, x, y, yaw, timeout_s=120):
        from geometry_msgs.msg import PoseStamped
        from nav2_simple_commander.robot_navigator import TaskResult
        goal = PoseStamped()
        goal.header.frame_id = "map"
        goal.header.stamp = self.nav.get_clock().now().to_msg()
        goal.pose.position.x, goal.pose.position.y = float(x), float(y)
        goal.pose.orientation.z, goal.pose.orientation.w = math.sin(yaw / 2), math.cos(yaw / 2)
        self.nav.goToPose(goal)
        t0 = time.monotonic()
        while not self.nav.isTaskComplete():
            fb = self.nav.getFeedback()
            if fb is not None:
                p = fb.current_pose.pose
                self._pose = {"x": p.position.x, "y": p.position.y,
                              "yaw": 2 * math.atan2(p.orientation.z, p.orientation.w)}
            if time.monotonic() - t0 > timeout_s:
                self.nav.cancelTask()
                return False
            time.sleep(0.2)
        return self.nav.getResult() == TaskResult.SUCCEEDED

    def pose(self):
        return getattr(self, "_pose", {})


class Go2WebRtc(_Nav2Mixin, Robot):
    """Go2 Air/Pro/EDU over Wi-Fi. Run go2_ros2_sdk first:
    ros2 launch go2_robot_sdk robot.launch.py   (with ROBOT_IP set to the Go2's Wi-Fi IP)"""

    def __init__(self):
        from go2_interfaces.msg import WebRtcReq
        from sensor_msgs.msg import BatteryState
        self._init_nav()
        self._Req = WebRtcReq
        self.pub = self.nav.create_publisher(WebRtcReq, "/webrtc_req", 10)
        self._battery = None
        self.nav.create_subscription(BatteryState, "/battery_state",
                                     lambda m: setattr(self, "_battery", m.percentage), 10)

    def _sport(self, name, params=None):
        msg = self._Req()
        msg.id = 0
        msg.topic = "rt/api/sport/request"
        msg.api_id = SPORT_API[name]
        msg.parameter = json.dumps(params) if params else ""
        msg.priority = 1 if name == "StopMove" else 0
        self.pub.publish(msg)
        time.sleep(0.1)

    def sniff_posture(self):
        self._sport("StopMove")
        self._sport("Euler", {"x": 0.0, "y": SNIFF_PITCH_RAD, "z": 0.0})

    def normal_posture(self):
        self._sport("Euler", {"x": 0.0, "y": 0.0, "z": 0.0})

    def sit(self):
        self._sport("StopMove")
        self._sport("Sit")

    def stand(self):
        self._sport("RiseSit")
        time.sleep(1.0)
        self._sport("BalanceStand")

    def stop(self):
        self.nav.cancelTask()
        self._sport("StopMove")

    def battery(self):
        return self._battery


class Go2Sdk2(_Nav2Mixin, Robot):
    """Go2 EDU over Ethernet (Pi eth0 on 192.168.123.0/24) with unitree_sdk2_python."""

    def __init__(self, iface="eth0"):
        from unitree_sdk2py.core.channel import ChannelFactoryInitialize
        from unitree_sdk2py.go2.sport.sport_client import SportClient
        ChannelFactoryInitialize(0, iface)
        self.sport = SportClient()
        self.sport.SetTimeout(10.0)
        self.sport.Init()
        self._init_nav()

    def sniff_posture(self):
        self.sport.StopMove()
        self.sport.Euler(0.0, SNIFF_PITCH_RAD, 0.0)

    def normal_posture(self):
        self.sport.Euler(0.0, 0.0, 0.0)

    def sit(self):
        self.sport.StopMove()
        self.sport.Sit()

    def stand(self):
        self.sport.RiseSit()
        time.sleep(1.0)
        self.sport.BalanceStand()

    def stop(self):
        self.nav.cancelTask()
        self.sport.StopMove()

    def battery(self):
        return None  # subscribe to rt/lowstate (bms_state.soc) if you need it on EDU


class SimRobot(Robot):
    def __init__(self):
        self._pose = {"x": 0.0, "y": 0.0, "yaw": 0.0}

    def go_to(self, x, y, yaw, timeout_s=120):
        print(f"[sim] go_to ({x:.2f}, {y:.2f}, {yaw:.2f})")
        self._pose = {"x": x, "y": y, "yaw": yaw}
        return True

    def sniff_posture(self): print("[sim] nose down")
    def normal_posture(self): print("[sim] level")
    def sit(self): print("[sim] SIT (alert)")
    def stand(self): print("[sim] stand")
    def stop(self): print("[sim] STOP")
    def pose(self): return dict(self._pose)
    def battery(self): return 100.0


def make_robot(kind: str) -> Robot:
    return {"webrtc": Go2WebRtc, "sdk2": Go2Sdk2, "sim": SimRobot}[kind]()
