"""Run: pytest -q  (from the hub/ folder)"""
import importlib
import os
import time

import pytest
from fastapi.testclient import TestClient

K = {"X-Hub-Key": "test-key"}


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("HUB_DB", str(tmp_path / "hub.sqlite3"))
    monkeypatch.setenv("HUB_KEY", "test-key")
    monkeypatch.setenv("HUB_UNIT_TIMEOUT_S", "60")
    import hub
    importlib.reload(hub)
    return TestClient(hub.app), hub


def reg(c, uid, caps=("patrol", "confirm", "nose")):
    assert c.post("/api/units/register", json={"unit_id": uid, "capabilities": list(caps)}, headers=K).status_code == 200


def test_key_required(client):
    c, _ = client
    assert c.get("/api/units").status_code == 401


def test_patrol_alert_spawns_confirm_for_other_unit(client):
    c, _ = client
    reg(c, "k9-a"); reg(c, "k9-b")
    tid = c.post("/api/tasks", json={"kind": "patrol", "site": "Hotel", "room": "204"}, headers=K).json()["task_id"]
    t = c.post("/api/units/k9-a/next-task", headers=K).json()["task"]
    assert t["task_id"] == tid and t["status"] == "running"
    r = c.post(f"/api/tasks/{tid}/events", headers=K, json={
        "unit_id": "k9-a", "type": "alert", "data": {"p_bedbug": 0.91, "station": 7, "pose": {"x": 1, "y": 2}}}).json()
    conf_id = r["spawned_task"]
    # the unit that alerted must not get its own confirm task
    assert c.post("/api/units/k9-a/next-task", headers=K).json()["task"]["task_id"] == tid  # still on its patrol
    c.post(f"/api/tasks/{tid}/events", headers=K, json={"unit_id": "k9-a", "type": "done", "data": {}})
    assert c.post("/api/units/k9-a/next-task", headers=K).json()["task"] is None
    got = c.post("/api/units/k9-b/next-task", headers=K).json()["task"]
    assert got["task_id"] == conf_id and got["kind"] == "confirm" and got["priority"] == 1
    assert got["params"]["station"] == 7
    c.post(f"/api/tasks/{conf_id}/events", headers=K, json={"unit_id": "k9-b", "type": "done", "data": {"confirmed": True}})
    rep = c.get("/api/reports/Hotel", headers=K).json()["rooms"][0]
    assert rep["verdict"].startswith("ACTIVE") and rep["alerts"] == 1 and rep["confirmed"] == 1
    alerts = c.get("/api/alerts", headers=K).json()
    assert alerts[0]["confirmations"][0]["status"] == "done"


def test_capabilities_and_priority(client):
    c, _ = client
    reg(c, "wand-1", caps=("confirm", "nose"))
    c.post("/api/tasks", json={"kind": "patrol", "site": "S", "room": "1", "priority": 1}, headers=K)
    low = c.post("/api/tasks", json={"kind": "calibrate", "site": "S", "priority": 5}, headers=K).json()["task_id"]
    # the wand can't patrol, so it gets the calibrate task
    assert c.post("/api/units/wand-1/next-task", headers=K).json()["task"]["task_id"] == low


def test_stale_unit_task_requeued(client):
    c, hub = client
    reg(c, "k9-a"); reg(c, "k9-b")
    tid = c.post("/api/tasks", json={"kind": "patrol", "site": "S", "room": "1"}, headers=K).json()["task_id"]
    c.post("/api/units/k9-a/next-task", headers=K)
    with hub.db() as db:
        db.execute("UPDATE units SET last_seen=? WHERE unit_id='k9-a'", (time.time() - 3600,))
    c.post("/api/units/k9-b/heartbeat", headers=K, json={"state": "idle"})
    assert c.post("/api/units/k9-b/next-task", headers=K).json()["task"]["task_id"] == tid


def test_stop_all_delivered_once(client):
    c, _ = client
    reg(c, "k9-a")
    c.post("/api/stop-all", headers=K)
    assert c.post("/api/units/k9-a/heartbeat", headers=K, json={}).json()["command"] == {"type": "stop"}
    assert c.post("/api/units/k9-a/heartbeat", headers=K, json={}).json()["command"] is None


def test_dashboard_served(client):
    c, _ = client
    assert "Robo-K9 Hub" in c.get("/").text


def test_concurrent_claims_never_double_assign(client):
    import concurrent.futures as cf
    c, _ = client
    for i in range(8):
        reg(c, f"k9-{i}")
    tid = c.post("/api/tasks", json={"kind": "patrol", "site": "S", "room": "1"}, headers=K).json()["task_id"]
    with cf.ThreadPoolExecutor(8) as ex:
        got = list(ex.map(lambda i: c.post(f"/api/units/k9-{i}/next-task", headers=K).json()["task"], range(8)))
    assert sum(1 for g in got if g and g["task_id"] == tid) == 1


def test_nearby_alerts_share_one_confirm(client):
    c, _ = client
    reg(c, "k9-a")
    tid = c.post("/api/tasks", json={"kind": "patrol", "site": "S", "room": "1"}, headers=K).json()["task_id"]
    c.post("/api/units/k9-a/next-task", headers=K)
    ev = lambda x: c.post(f"/api/tasks/{tid}/events", headers=K, json={
        "unit_id": "k9-a", "type": "alert", "data": {"pose": {"x": x, "y": 0}}}).json()["spawned_task"]
    assert ev(1.0) and ev(1.3) is None and ev(3.0)  # 0.3 m apart shares; 2 m away gets its own


def test_verdict_counts_confirm_tasks_not_alerts(client):
    c, _ = client
    reg(c, "k9-a"); reg(c, "wand", caps=("confirm",))
    tid = c.post("/api/tasks", json={"kind": "patrol", "site": "S", "room": "1"}, headers=K).json()["task_id"]
    c.post("/api/units/k9-a/next-task", headers=K)
    for x in (1.0, 1.2):  # two alerts, one shared confirm
        c.post(f"/api/tasks/{tid}/events", headers=K, json={"unit_id": "k9-a", "type": "alert", "data": {"pose": {"x": x, "y": 0}}})
    c.post(f"/api/tasks/{tid}/events", headers=K, json={"unit_id": "k9-a", "type": "done", "data": {}})
    assert c.get("/api/reports/S", headers=K).json()["rooms"][0]["verdict"].startswith("SUSPECT - confirmation pending")
    conf = c.post("/api/units/wand/next-task", headers=K).json()["task"]["task_id"]
    c.post(f"/api/tasks/{conf}/events", headers=K, json={"unit_id": "wand", "type": "done", "data": {"confirmed": False}})
    assert c.get("/api/reports/S", headers=K).json()["rooms"][0]["verdict"] == "CLEAR - alerts not confirmed"
