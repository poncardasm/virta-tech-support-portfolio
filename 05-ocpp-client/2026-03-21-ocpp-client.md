# OCPP Charger Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal OCPP 1.6 JSON WebSocket client that simulates a charging station executing a full session lifecycle — BootNotification through StopTransaction — logging each message exchange to the terminal. Demonstrates understanding of OCPP for the Virta Technical Support Specialist role.

**Architecture:** Three Python modules: `ocpp_client.py` (message builder + send/receive logic), `mock_cs.py` (in-process mock Central System for `--mock` mode), and `simulate.py` (CLI entry point and session orchestration). Tests use `pytest` + `pytest-asyncio`.

**Tech Stack:** Python 3.9+, `websockets`, `pytest`, `pytest-asyncio`.

---

## File Map

```
05-ocpp-client/
  simulate.py            ← CLI entry point and session orchestration
  ocpp_client.py         ← OCPP message builder and send/receive
  mock_cs.py             ← In-process mock Central System
  tests/
    test_ocpp_client.py  ← unit tests
  README.md              ← setup, usage, OCPP background notes
  PRD.md                 ← product requirements (already exists)
```

---

## Task 1: Project Bootstrap

**Files:**
- Create: `05-ocpp-client/requirements.txt`
- Create: `05-ocpp-client/requirements-dev.txt`
- Create: `05-ocpp-client/.gitignore`

- [ ] **Step 1: Write requirements.txt**

```
websockets>=12.0
```

- [ ] **Step 2: Write requirements-dev.txt**

```
pytest>=7.0
pytest-asyncio>=0.23
```

- [ ] **Step 3: Write .gitignore**

```
__pycache__/
*.pyc
.pytest_cache/
*.egg-info/
dist/
```

- [ ] **Step 4: Install dependencies**

```bash
cd 05-ocpp-client
pip install -r requirements.txt -r requirements-dev.txt
```

- [ ] **Step 5: Commit**

```bash
git add 05-ocpp-client/requirements.txt 05-ocpp-client/requirements-dev.txt 05-ocpp-client/.gitignore
git commit -m "feat(ocpp): bootstrap project with websockets dependency"
```

---

## Task 2: OCPP Client Module

**Files:**
- Create: `05-ocpp-client/ocpp_client.py`

This module handles message construction, sending, and receiving. It does not manage connection lifecycle (that's in `simulate.py`).

- [ ] **Step 1: Write ocpp_client.py**

```python
"""OCPP 1.6 message builder and send/receive logic."""

import json
import uuid
from datetime import datetime, timezone


CALL = 2
CALLRESULT = 3
CALLERROR = 4

TIMESTAMP_FMT = "%Y-%m-%dT%H:%M:%SZ"


def now():
    return datetime.now(timezone.utc).strftime(TIMESTAMP_FMT)


def make_call(action, payload):
    """Build an OCPP CALL frame: [2, uniqueId, action, payload]."""
    return [CALL, str(uuid.uuid4()), action, payload]


def encode(message):
    return json.dumps(message)


def decode(raw):
    return json.loads(raw)


def log_message(direction, msg_type_label, action, payload):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    arrow = "→" if direction == "send" else "←"
    print(f"[{timestamp}] {arrow} {msg_type_label:<12} {action:<22} {json.dumps(payload)}")


async def send_call(websocket, action, payload):
    """Send a CALL and return (unique_id, action, payload) for matching."""
    frame = make_call(action, payload)
    unique_id = frame[1]
    log_message("send", "CALL", action, payload)
    await websocket.send(encode(frame))
    return unique_id


async def receive_result(websocket, unique_id, action):
    """Wait for a CALLRESULT or CALLERROR matching unique_id. Returns payload."""
    raw = await websocket.recv()
    frame = decode(raw)
    msg_type = frame[0]

    if msg_type == CALLRESULT:
        result_id, result_payload = frame[1], frame[2]
        if result_id != unique_id:
            raise ValueError(f"UniqueId mismatch: expected {unique_id}, got {result_id}")
        log_message("recv", "CALLRESULT", action, result_payload)
        return result_payload

    elif msg_type == CALLERROR:
        _, error_id, error_code, description, _ = frame
        log_message("recv", "CALLERROR", action, {"errorCode": error_code, "description": description})
        raise RuntimeError(f"CALLERROR for {action}: {error_code} — {description}")

    else:
        raise ValueError(f"Unexpected message type: {msg_type}")


async def call(websocket, action, payload):
    """Send a CALL and wait for its CALLRESULT. Returns result payload."""
    unique_id = await send_call(websocket, action, payload)
    return await receive_result(websocket, unique_id, action)
```

- [ ] **Step 2: Commit**

```bash
git add 05-ocpp-client/ocpp_client.py
git commit -m "feat(ocpp): add OCPP message builder and call/receive logic"
```

---

## Task 3: Mock Central System

**Files:**
- Create: `05-ocpp-client/mock_cs.py`

A minimal asyncio WebSocket server that auto-accepts all OCPP CALL messages with sensible responses.

- [ ] **Step 1: Write mock_cs.py**

```python
"""In-process mock OCPP Central System for --mock mode."""

import asyncio
import json
import uuid
from datetime import datetime, timezone

import websockets

HOST = "localhost"
PORT = 9000
TIMESTAMP_FMT = "%Y-%m-%dT%H:%M:%SZ"


def now():
    return datetime.now(timezone.utc).strftime(TIMESTAMP_FMT)


RESPONSES = {
    "BootNotification": {"status": "Accepted", "currentTime": None, "interval": 300},
    "Heartbeat": {"currentTime": None},
    "StatusNotification": {},
    "StartTransaction": {"transactionId": None, "idTagInfo": {"status": "Accepted"}},
    "StopTransaction": {"idTagInfo": {"status": "Accepted"}},
    "MeterValues": {},
}


def build_response(action, call_payload):
    template = RESPONSES.get(action, {}).copy()
    if "currentTime" in template:
        template["currentTime"] = now()
    if action == "StartTransaction":
        template = template.copy()
        template["transactionId"] = int(uuid.uuid4().int % 100000)
    return template


async def handle(websocket):
    async for raw in websocket:
        frame = json.loads(raw)
        msg_type = frame[0]
        if msg_type == 2:  # CALL
            _, unique_id, action, payload = frame
            result_payload = build_response(action, payload)
            response = json.dumps([3, unique_id, result_payload])
            await websocket.send(response)


async def start_server():
    return await websockets.serve(handle, HOST, PORT)


def url(charger_id="CP001"):
    return f"ws://{HOST}:{PORT}/ocpp/{charger_id}"
```

- [ ] **Step 2: Commit**

```bash
git add 05-ocpp-client/mock_cs.py
git commit -m "feat(ocpp): add in-process mock Central System"
```

---

## Task 4: Simulator CLI

**Files:**
- Create: `05-ocpp-client/simulate.py`

Session orchestration: connects to the CS, runs the 9-step OCPP sequence, logs each step, disconnects cleanly.

- [ ] **Step 1: Write simulate.py**

```python
#!/usr/bin/env python3
"""OCPP 1.6 charger simulator CLI."""

import argparse
import asyncio
import sys

import websockets

import ocpp_client as ocpp


CHARGER_MODEL = "VirtaSim"
CHARGER_VENDOR = "VirtaLab"
FIRMWARE_VERSION = "1.0.0"
METER_VALUE_WH = 5000


def parse_args():
    parser = argparse.ArgumentParser(description="OCPP 1.6 charger simulator")
    parser.add_argument(
        "url", nargs="?", default=None,
        help="Central System WebSocket URL (e.g. ws://localhost:9000/ocpp/CP001)"
    )
    parser.add_argument(
        "--charger-id", default="CP001", help="Charge point identity (default: CP001)"
    )
    parser.add_argument(
        "--delay", type=float, default=1.0,
        help="Seconds to wait between messages (default: 1)"
    )
    parser.add_argument(
        "--mock", action="store_true",
        help="Start an in-process mock Central System and connect to it"
    )
    return parser.parse_args()


async def run_session(ws, charger_id, delay):
    sleep = lambda: asyncio.sleep(delay)

    # 1. BootNotification
    result = await ocpp.call(ws, "BootNotification", {
        "chargePointModel": CHARGER_MODEL,
        "chargePointVendor": CHARGER_VENDOR,
        "firmwareVersion": FIRMWARE_VERSION,
        "chargePointSerialNumber": charger_id,
    })
    if result.get("status") != "Accepted":
        raise RuntimeError(f"BootNotification rejected: {result}")
    await sleep()

    # 2. Heartbeat
    await ocpp.call(ws, "Heartbeat", {})
    await sleep()

    # 3. StatusNotification — Available
    await ocpp.call(ws, "StatusNotification", {
        "connectorId": 1, "status": "Available", "errorCode": "NoError"
    })
    await sleep()

    # 4. StartTransaction
    result = await ocpp.call(ws, "StartTransaction", {
        "connectorId": 1,
        "idTag": "RFID-001",
        "meterStart": 0,
        "timestamp": ocpp.now(),
    })
    transaction_id = result["transactionId"]
    await sleep()

    # 5. StatusNotification — Charging
    await ocpp.call(ws, "StatusNotification", {
        "connectorId": 1, "status": "Charging", "errorCode": "NoError"
    })
    await sleep()

    # 6. MeterValues
    await ocpp.call(ws, "MeterValues", {
        "connectorId": 1,
        "transactionId": transaction_id,
        "meterValue": [{
            "timestamp": ocpp.now(),
            "sampledValue": [{"value": str(METER_VALUE_WH), "unit": "Wh"}],
        }],
    })
    await sleep()

    # 7. StopTransaction
    await ocpp.call(ws, "StopTransaction", {
        "transactionId": transaction_id,
        "idTag": "RFID-001",
        "meterStop": METER_VALUE_WH,
        "timestamp": ocpp.now(),
    })
    await sleep()

    # 8. StatusNotification — Available
    await ocpp.call(ws, "StatusNotification", {
        "connectorId": 1, "status": "Available", "errorCode": "NoError"
    })


async def main_async(args):
    if args.mock:
        from mock_cs import start_server, url as mock_url
        server = await start_server()
        connect_url = mock_url(args.charger_id)
        print(f"Mock CS started. Connecting to {connect_url}")
    else:
        if not args.url:
            print("Error: provide a CS URL or use --mock", file=sys.stderr)
            sys.exit(1)
        connect_url = args.url
        server = None

    try:
        async with websockets.connect(
            connect_url,
            subprotocols=["ocpp1.6"],
        ) as ws:
            await run_session(ws, args.charger_id, args.delay)
        print("\nSession complete. Disconnected cleanly.")
    finally:
        if server:
            server.close()
            await server.wait_closed()


def main():
    args = parse_args()
    try:
        asyncio.run(main_async(args))
    except RuntimeError as e:
        print(f"\nError: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Smoke test**

```bash
cd 05-ocpp-client
python simulate.py --mock
```

Expected: All 9 OCPP messages logged with `→ CALL` and `← CALLRESULT` pairs, ends with "Session complete."

- [ ] **Step 3: Commit**

```bash
git add 05-ocpp-client/simulate.py
git commit -m "feat(ocpp): add simulator CLI with full session sequence"
```

---

## Task 5: Tests

**Files:**
- Create: `05-ocpp-client/tests/__init__.py`
- Create: `05-ocpp-client/tests/test_ocpp_client.py`

- [ ] **Step 1: Write tests/test_ocpp_client.py**

```python
import json
import pytest
import asyncio

import ocpp_client as ocpp


def test_make_call_structure():
    frame = ocpp.make_call("BootNotification", {"chargePointModel": "Test"})
    assert frame[0] == 2
    assert isinstance(frame[1], str)  # unique_id
    assert frame[2] == "BootNotification"
    assert frame[3] == {"chargePointModel": "Test"}


def test_make_call_unique_ids():
    a = ocpp.make_call("Heartbeat", {})
    b = ocpp.make_call("Heartbeat", {})
    assert a[1] != b[1]


def test_encode_decode_roundtrip():
    frame = ocpp.make_call("StatusNotification", {"status": "Available"})
    raw = ocpp.encode(frame)
    decoded = ocpp.decode(raw)
    assert decoded == frame


class MockWebSocket:
    """Minimal websocket stub for testing send/receive."""

    def __init__(self, responses):
        self._responses = iter(responses)
        self.sent = []

    async def send(self, data):
        self.sent.append(data)

    async def recv(self):
        return next(self._responses)


@pytest.mark.asyncio
async def test_call_success():
    call_frame = None

    class CaptureWS(MockWebSocket):
        async def send(self, data):
            nonlocal call_frame
            call_frame = json.loads(data)
            await super().send(data)

    unique_id_holder = {}

    async def make_response():
        # We need the uniqueId from the sent frame — use a pre-set id
        return json.dumps([3, "test-id", {"status": "Accepted", "currentTime": "2026-03-21T10:00:00Z", "interval": 300}])

    # Patch make_call to return a known uniqueId
    original_make_call = ocpp.make_call
    ocpp.make_call = lambda action, payload: [2, "test-id", action, payload]

    ws = MockWebSocket([
        json.dumps([3, "test-id", {"status": "Accepted", "currentTime": "2026-03-21T10:00:00Z", "interval": 300}])
    ])

    result = await ocpp.call(ws, "BootNotification", {"chargePointModel": "Test"})
    assert result["status"] == "Accepted"

    ocpp.make_call = original_make_call


@pytest.mark.asyncio
async def test_callerror_raises():
    ocpp.make_call = lambda action, payload: [2, "err-id", action, payload]

    ws = MockWebSocket([
        json.dumps([4, "err-id", "NotSupported", "Action not supported", {}])
    ])

    with pytest.raises(RuntimeError, match="CALLERROR"):
        await ocpp.call(ws, "BootNotification", {})

    import ocpp_client
    ocpp_client.make_call = ocpp_client.__dict__["make_call"]  # restore


@pytest.mark.asyncio
async def test_uniqueid_mismatch_raises():
    import uuid
    ocpp.make_call = lambda action, payload: [2, "my-id", action, payload]

    ws = MockWebSocket([
        json.dumps([3, "wrong-id", {"status": "Accepted"}])
    ])

    with pytest.raises(ValueError, match="UniqueId mismatch"):
        await ocpp.call(ws, "Heartbeat", {})
```

- [ ] **Step 2: Create tests/__init__.py** (empty file)

- [ ] **Step 3: Run tests**

```bash
cd 05-ocpp-client
pytest
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add 05-ocpp-client/tests/
git commit -m "feat(ocpp): add pytest test suite"
```

---

## Task 6: README

**Files:**
- Create: `05-ocpp-client/README.md`

- [ ] **Step 1: Write README.md**

````markdown
# OCPP Charger Simulator

A minimal OCPP 1.6 JSON WebSocket client that simulates a charging station executing a full session lifecycle. Demonstrates understanding of the OCPP protocol used by Virta's charging network.

## Usage

```bash
# Run with built-in mock Central System
python simulate.py --mock

# Run against a real Central System
python simulate.py ws://your-cs-host:9000/ocpp/CP001

# Custom charger ID and message delay
python simulate.py --mock --charger-id CP042 --delay 0.5
```

## OCPP Background

OCPP (Open Charge Point Protocol) is the standard protocol for communication between EV charging stations (Charge Points) and a Central System (CS). Virta's hardware uses OCPP 1.6 JSON over WebSocket.

**Message types:**

| Type | Code | Direction |
|------|------|-----------|
| CALL | 2 | CP → CS (request) |
| CALLRESULT | 3 | CS → CP (success response) |
| CALLERROR | 4 | CS → CP (error response) |

**Session lifecycle simulated:**

```
BootNotification   → register with CS, get Accepted
Heartbeat          → keep-alive
StatusNotification → Available
StartTransaction   → begin charging session, receive transactionId
StatusNotification → Charging
MeterValues        → mid-session energy reading
StopTransaction    → end session using transactionId
StatusNotification → Available
```

## Requirements

```bash
pip install -r requirements.txt
```

## Running Tests

```bash
pip install -r requirements-dev.txt
pytest
```
````

- [ ] **Step 2: Commit**

```bash
git add 05-ocpp-client/README.md
git commit -m "docs(ocpp): add README with usage and OCPP background"
```

---

## Task 7: Final Verification

- [ ] `python simulate.py --mock` completes full sequence and exits cleanly
- [ ] All 9 message pairs logged (→ CALL / ← CALLRESULT)
- [ ] `transactionId` from `StartTransaction` used in `StopTransaction`
- [ ] `pytest` passes with no failures
