"""Robo-K9 Hub: one place to register units, assign duties, collect results and report.

Run on any laptop, mini PC or spare Raspberry Pi on the site network:

    pip install -r requirements.txt
    HUB_KEY=change-me uvicorn hub:app --host 0.0.0.0 --port 8080

Then open http://<hub-ip>:8080 for the dashboard.

Units (robot + nose) talk to the hub over plain HTTP using a pull model: they send a
heartbeat every few seconds and ask for their next task. That works over any Wi-Fi or
LTE link without opening ports on the robots. Every request must carry the header
`X-Hub-Key: <HUB_KEY>`.

Duties ("task kinds"):
    patrol     search a room: visit sniff stations, report every sniff
    confirm    re-check an alert location with a DIFFERENT unit, or with a wand handler
    recheck    scheduled follow-up search of a room after treatment
    calibrate  sniff the reference vial and blanks to check for drift

Rules the hub applies automatically:
    * An alert on a patrol creates a high-priority `confirm` task at that spot. It goes to a
      different unit or a wand, never the unit that raised the alert (a second opinion, like
      a handler confirming a dog's alert).
    * If a unit misses heartbeats for UNIT_TIMEOUT_S, its running task goes back in the queue.
    * The "Stop all" button sends a `stop` command with the next heartbeat reply.
"""

import json
import os
import sqlite3
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

DB_PATH = os.environ.get("HUB_DB", str(Path(__file__).with_name("hub.sqlite3")))
HUB_KEY = os.environ.get("HUB_KEY", "change-me")
UNIT_TIMEOUT_S = float(os.environ.get("HUB_UNIT_TIMEOUT_S", "60"))
TASK_KINDS = {"patrol", "confirm", "recheck", "calibrate"}
# Which capability a unit needs to take each kind of task.
KIND_NEEDS = {"patrol": "patrol", "recheck": "patrol", "confirm": "confirm", "calibrate": "nose"}

SCHEMA = """
CREATE TABLE IF NOT EXISTS units (
    unit_id TEXT PRIMARY KEY, name TEXT, robot_model TEXT, capabilities TEXT,
    state TEXT, battery REAL, pose TEXT, current_task TEXT, pending_command TEXT,
    last_seen REAL, registered REAL);
CREATE TABLE IF NOT EXISTS tasks (
    task_id TEXT PRIMARY KEY, kind TEXT, site TEXT, room TEXT, priority INTEGER,
    params TEXT, status TEXT, assigned_unit TEXT, exclude_unit TEXT, target_unit TEXT,
    parent_task TEXT, created REAL, started REAL, finished REAL, summary TEXT);
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT, task_id TEXT, unit_id TEXT, type TEXT,
    ts REAL, data TEXT);
CREATE INDEX IF NOT EXISTS ev_task ON events(task_id);
"""

app = FastAPI(title="Robo-K9 Hub")


@contextmanager
def db():
    # isolation_level=None + BEGIN IMMEDIATE: each request is one write-locked transaction,
    # so two units can never claim the same task.
    conn = sqlite3.connect(DB_PATH, timeout=10, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("BEGIN IMMEDIATE")
    try:
        yield conn
        conn.execute("COMMIT")
    except BaseException:
        conn.execute("ROLLBACK")
        raise
    finally:
        conn.close()


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)
    conn.close()


init_db()


def require_key(x_hub_key: str = Header(default="")):
    if x_hub_key != HUB_KEY:
        raise HTTPException(401, "bad or missing X-Hub-Key")


def row(r: Optional[sqlite3.Row]) -> Optional[dict]:
    if r is None:
        return None
    d = dict(r)
    for k in ("capabilities", "pose", "params", "summary", "data", "pending_command"):
        if k in d and isinstance(d[k], str):
            try:
                d[k] = json.loads(d[k])
            except ValueError:
                pass
    return d


# --- models ---------------------------------------------------------------------
class UnitIn(BaseModel):
    unit_id: str
    name: str = ""
    robot_model: str = "Unitree Go2 Pro"
    capabilities: list[str] = Field(default_factory=lambda: ["patrol", "confirm", "nose"])


class Heartbeat(BaseModel):
    state: str = "idle"          # idle | busy | charging | error | stopped
    battery: Optional[float] = None
    pose: Optional[dict] = None  # {"x":..,"y":..,"yaw":..,"map":..}
    current_task: Optional[str] = None


class TaskIn(BaseModel):
    kind: str
    site: str
    room: str = ""
    priority: int = 5            # 1 = most urgent
    params: dict[str, Any] = Field(default_factory=dict)
    target_unit: Optional[str] = None


class EventIn(BaseModel):
    unit_id: str
    type: str                    # progress | sniff | alert | done | failed
    data: dict[str, Any] = Field(default_factory=dict)


# --- core logic ------------------------------------------------------------------
def requeue_stale(c: sqlite3.Connection):
    cutoff = time.time() - UNIT_TIMEOUT_S
    stale = c.execute("SELECT unit_id FROM units WHERE last_seen < ? AND state != 'offline'", (cutoff,)).fetchall()
    for (uid,) in stale:
        c.execute("UPDATE tasks SET status='queued', assigned_unit=NULL, started=NULL "
                  "WHERE assigned_unit=? AND status='running'", (uid,))
        c.execute("UPDATE units SET state='offline', current_task=NULL WHERE unit_id=?", (uid,))


def create_task(c: sqlite3.Connection, t: TaskIn, parent: Optional[str] = None,
                exclude_unit: Optional[str] = None) -> str:
    if t.kind not in TASK_KINDS:
        raise HTTPException(400, f"kind must be one of {sorted(TASK_KINDS)}")
    tid = "T-" + uuid.uuid4().hex[:8]
    c.execute("INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              (tid, t.kind, t.site, t.room, t.priority, json.dumps(t.params), "queued", None,
               exclude_unit, t.target_unit, parent, time.time(), None, None, None))
    return tid


def open_confirm_near(c: sqlite3.Connection, t: dict, pose: Optional[dict], radius_m: float = 0.5) -> bool:
    """True if a queued/running confirm for this room already covers this spot."""
    for r in c.execute("SELECT params FROM tasks WHERE kind='confirm' AND site=? AND room=? "
                       "AND status IN ('queued','running')", (t["site"], t["room"])):
        loc = json.loads(r["params"] or "{}").get("location")
        if not pose or not loc:
            return True
        if ((loc.get("x", 0) - pose.get("x", 0)) ** 2 + (loc.get("y", 0) - pose.get("y", 0)) ** 2) ** 0.5 <= radius_m:
            return True
    return False


# --- unit endpoints --------------------------------------------------------------
@app.post("/api/units/register", dependencies=[Depends(require_key)])
def register(u: UnitIn):
    with db() as c:
        c.execute("INSERT INTO units (unit_id,name,robot_model,capabilities,state,last_seen,registered) "
                  "VALUES (?,?,?,?,?,?,?) ON CONFLICT(unit_id) DO UPDATE SET name=excluded.name, "
                  "robot_model=excluded.robot_model, capabilities=excluded.capabilities, "
                  "state='idle', last_seen=excluded.last_seen",
                  (u.unit_id, u.name or u.unit_id, u.robot_model, json.dumps(u.capabilities),
                   "idle", time.time(), time.time()))
    return {"ok": True}


@app.post("/api/units/{unit_id}/heartbeat", dependencies=[Depends(require_key)])
def heartbeat(unit_id: str, hb: Heartbeat):
    with db() as c:
        u = c.execute("SELECT pending_command FROM units WHERE unit_id=?", (unit_id,)).fetchone()
        if u is None:
            raise HTTPException(404, "unit not registered")
        c.execute("UPDATE units SET state=?, battery=?, pose=?, current_task=?, last_seen=?, "
                  "pending_command=NULL WHERE unit_id=?",
                  (hb.state, hb.battery, json.dumps(hb.pose), hb.current_task, time.time(), unit_id))
        requeue_stale(c)
    cmd = json.loads(u["pending_command"]) if u["pending_command"] else None
    return {"ok": True, "command": cmd}


@app.post("/api/units/{unit_id}/next-task", dependencies=[Depends(require_key)])
def next_task(unit_id: str):
    """Hand the unit the most urgent queued task it is able to do (or null)."""
    with db() as c:
        u = row(c.execute("SELECT * FROM units WHERE unit_id=?", (unit_id,)).fetchone())
        if u is None:
            raise HTTPException(404, "unit not registered")
        caps = set(u["capabilities"] or [])
        running = c.execute("SELECT * FROM tasks WHERE assigned_unit=? AND status='running'", (unit_id,)).fetchone()
        if running:
            return {"task": row(running)}
        for t in c.execute("SELECT * FROM tasks WHERE status='queued' ORDER BY priority, created").fetchall():
            if t["target_unit"] and t["target_unit"] != unit_id:
                continue
            if t["exclude_unit"] == unit_id:
                continue
            if KIND_NEEDS[t["kind"]] not in caps:
                continue
            claimed = c.execute("UPDATE tasks SET status='running', assigned_unit=?, started=? "
                                "WHERE task_id=? AND status='queued'",
                                (unit_id, time.time(), t["task_id"])).rowcount
            if not claimed:  # another unit got it first
                continue
            c.execute("UPDATE units SET state='busy', current_task=? WHERE unit_id=?", (t["task_id"], unit_id))
            return {"task": row(c.execute("SELECT * FROM tasks WHERE task_id=?", (t["task_id"],)).fetchone())}
    return {"task": None}


@app.post("/api/tasks/{task_id}/events", dependencies=[Depends(require_key)])
def post_event(task_id: str, ev: EventIn):
    with db() as c:
        t = row(c.execute("SELECT * FROM tasks WHERE task_id=?", (task_id,)).fetchone())
        if t is None:
            raise HTTPException(404, "no such task")
        c.execute("INSERT INTO events (task_id,unit_id,type,ts,data) VALUES (?,?,?,?,?)",
                  (task_id, ev.unit_id, ev.type, time.time(), json.dumps(ev.data)))
        spawned = None
        if ev.type == "alert" and t["kind"] in ("patrol", "recheck") and not open_confirm_near(c, t, ev.data.get("pose")):
            spawned = create_task(c, TaskIn(
                kind="confirm", site=t["site"], room=t["room"], priority=1,
                params={"location": ev.data.get("pose"), "station": ev.data.get("station"),
                        "p_bedbug": ev.data.get("p_bedbug"), "radius_m": 0.5}),
                parent=task_id, exclude_unit=ev.unit_id)
        if ev.type in ("done", "failed"):
            c.execute("UPDATE tasks SET status=?, finished=?, summary=? WHERE task_id=?",
                      ("done" if ev.type == "done" else "failed", time.time(), json.dumps(ev.data), task_id))
            c.execute("UPDATE units SET state='idle', current_task=NULL WHERE unit_id=?", (ev.unit_id,))
    return {"ok": True, "spawned_task": spawned}


# --- operator endpoints ----------------------------------------------------------
@app.post("/api/tasks", dependencies=[Depends(require_key)])
def add_task(t: TaskIn):
    with db() as c:
        return {"task_id": create_task(c, t)}


@app.post("/api/tasks/{task_id}/cancel", dependencies=[Depends(require_key)])
def cancel_task(task_id: str):
    with db() as c:
        t = c.execute("SELECT assigned_unit, status FROM tasks WHERE task_id=?", (task_id,)).fetchone()
        if t is None:
            raise HTTPException(404, "no such task")
        c.execute("UPDATE tasks SET status='cancelled', finished=? WHERE task_id=?", (time.time(), task_id))
        if t["assigned_unit"] and t["status"] == "running":
            c.execute("UPDATE units SET pending_command=? WHERE unit_id=?",
                      (json.dumps({"type": "abort_task", "task_id": task_id}), t["assigned_unit"]))
    return {"ok": True}


@app.post("/api/units/{unit_id}/command", dependencies=[Depends(require_key)])
def send_command(unit_id: str, cmd: dict):
    """cmd: {"type": "stop" | "sit" | "stand" | "return_home" | "abort_task"}"""
    with db() as c:
        c.execute("UPDATE units SET pending_command=? WHERE unit_id=?", (json.dumps(cmd), unit_id))
    return {"ok": True}


@app.post("/api/stop-all", dependencies=[Depends(require_key)])
def stop_all():
    with db() as c:
        c.execute("UPDATE units SET pending_command=?", (json.dumps({"type": "stop"}),))
    return {"ok": True}


@app.get("/api/units", dependencies=[Depends(require_key)])
def list_units():
    with db() as c:
        requeue_stale(c)
        return [row(r) for r in c.execute("SELECT * FROM units ORDER BY unit_id")]


@app.get("/api/tasks", dependencies=[Depends(require_key)])
def list_tasks(site: Optional[str] = None, limit: int = 200):
    q, args = "SELECT * FROM tasks", []
    if site:
        q, args = q + " WHERE site=?", [site]
    with db() as c:
        return [row(r) for r in c.execute(q + " ORDER BY created DESC LIMIT ?", (*args, limit))]


@app.get("/api/alerts", dependencies=[Depends(require_key)])
def list_alerts(site: Optional[str] = None):
    """Every alert, plus the status of the confirm task that followed it."""
    with db() as c:
        rows = c.execute(
            "SELECT e.*, t.site, t.room FROM events e JOIN tasks t ON t.task_id=e.task_id "
            "WHERE e.type='alert'" + (" AND t.site=?" if site else "") + " ORDER BY e.ts DESC",
            (site,) if site else ()).fetchall()
        out = []
        for r in rows:
            d = row(r)
            conf = c.execute("SELECT task_id, status, summary FROM tasks WHERE parent_task=? AND kind='confirm'",
                             (d["task_id"],)).fetchall()
            d["confirmations"] = [row(x) for x in conf]
            out.append(d)
        return out


@app.get("/api/reports/{site}", dependencies=[Depends(require_key)])
def site_report(site: str):
    """Per-room roll-up for the client report."""
    with db() as c:
        tasks = [row(r) for r in c.execute("SELECT * FROM tasks WHERE site=? AND kind != 'calibrate'", (site,))]
        rooms: dict[str, dict] = {}
        for t in tasks:
            r = rooms.setdefault(t["room"] or "(unspecified)", {
                "room": t["room"], "searches": 0, "sniffs": 0, "alerts": 0,
                "confirmed": 0, "not_confirmed": 0, "open_confirms": 0, "max_p_bedbug": 0.0, "units": set()})
            if t["kind"] in ("patrol", "recheck") and t["status"] == "done":
                r["searches"] += 1
            if t["assigned_unit"]:
                r["units"].add(t["assigned_unit"])
            for e in c.execute("SELECT type, data FROM events WHERE task_id=?", (t["task_id"],)):
                data = json.loads(e["data"] or "{}")
                if e["type"] == "sniff":
                    r["sniffs"] += 1
                    r["max_p_bedbug"] = max(r["max_p_bedbug"], float(data.get("p_bedbug", 0)))
                elif e["type"] == "alert":
                    r["alerts"] += 1
            if t["kind"] == "confirm":
                if t["status"] == "done":
                    ok = bool((t["summary"] or {}).get("confirmed"))
                    r["confirmed" if ok else "not_confirmed"] += 1
                elif t["status"] in ("queued", "running"):
                    r["open_confirms"] += 1
        for r in rooms.values():
            r["units"] = sorted(r["units"])
            r["verdict"] = ("ACTIVE - confirmed" if r["confirmed"] else
                            "SUSPECT - confirmation pending" if r["open_confirms"] else
                            "CLEAR - alerts not confirmed" if r["alerts"] and r["not_confirmed"] else
                            "SUSPECT - alert with no confirmation" if r["alerts"] else
                            "CLEAR" if r["searches"] else "NOT SEARCHED")
        return {"site": site, "generated": time.time(), "rooms": list(rooms.values())}


@app.get("/")
def dashboard():
    return FileResponse(Path(__file__).with_name("static") / "index.html")
