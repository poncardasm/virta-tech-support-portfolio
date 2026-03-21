# Product Requirements Document — OCPP Charger Simulator

**Project:** 05 — OCPP Charger Simulator
**Portfolio:** Virta Technical Support Specialist
**Status:** Ready for implementation

---

## Overview

A minimal OCPP 1.6 WebSocket client written in Python that simulates a charging station communicating with a Central System (CS). The simulator sends a realistic sequence of OCPP messages, logs the exchange, and exits cleanly. The goal is to demonstrate genuine understanding of the protocol that Virta's hardware runs on.

---

## Problem Statement

EV charging support specialists at Virta work daily with issues that originate in the OCPP layer: stations failing to register, transactions that start but never stop, heartbeat timeouts, and status transitions. A specialist who can read and reason about raw OCPP message logs — and who understands the protocol's call/response structure — can diagnose these issues far faster than one who treats the charging stack as a black box.

---

## Goals

- Demonstrate understanding of OCPP 1.6 JSON message format (CALL / CALLRESULT / CALLERROR)
- Implement the core message sequence a charger sends during a full session lifecycle
- Produce clean, readable log output that shows the protocol exchange
- Keep the simulator runnable against a real or mock CS endpoint

---

## Non-Goals

- Full OCPP 1.6 compliance (all message types)
- OCPP 2.0 / 2.0.1 support
- GUI or web interface
- Multi-charger simulation
- TLS / authentication
- Persistent state across runs

---

## Users

| User | Description |
|------|-------------|
| Portfolio reviewer | Runs the simulator to observe the OCPP exchange in the terminal |
| Support specialist | Uses the simulator to test or understand CS behaviour during troubleshooting |

---

## OCPP Message Sequence

The simulator executes this sequence in order:

```
1. WebSocket connect to CS URL
2. BootNotification        → wait for Accepted
3. Heartbeat               → log response
4. StatusNotification      (status: Available)
5. StartTransaction        → wait for transactionId
6. StatusNotification      (status: Charging)
7. MeterValues             (mid-session sample)
8. StopTransaction         (using transactionId from step 5)
9. StatusNotification      (status: Available)
10. Clean disconnect
```

---

## Message Format

OCPP 1.6 JSON over WebSocket. Three message types:

| Type | Format |
|------|--------|
| CALL | `[2, "<uniqueId>", "<Action>", {payload}]` |
| CALLRESULT | `[3, "<uniqueId>", {payload}]` |
| CALLERROR | `[4, "<uniqueId>", "<errorCode>", "<description>", {}]` |

Each CALL blocks until a matching CALLRESULT or CALLERROR is received (matched by `uniqueId`).

---

## Features

### 1. CLI Interface

```
usage: simulate.py [-h] [--charger-id CHARGER_ID] [--delay DELAY] url

positional arguments:
  url                   Central System WebSocket URL
                        e.g. ws://localhost:9000/ocpp/CP001

optional arguments:
  --charger-id ID       Charge point identity string (default: CP001)
  --delay DELAY         Seconds to wait between messages (default: 1)
```

### 2. Log Output

Each message printed to stdout with direction and timestamp:

```
[2026-03-21 10:00:01] → CALL       BootNotification     {"chargePointModel": "VirtaSim", ...}
[2026-03-21 10:00:01] ← CALLRESULT BootNotification     {"status": "Accepted", "currentTime": "..."}
[2026-03-21 10:00:02] → CALL       Heartbeat            {}
[2026-03-21 10:00:02] ← CALLRESULT Heartbeat            {"currentTime": "..."}
...
```

### 3. Mock CS Mode

When run without a real CS, the simulator can start its own in-process mock server (a simple asyncio WebSocket server) that auto-accepts all messages. Activated by passing `--mock` flag.

```bash
python simulate.py --mock
# Starts a local CS on ws://localhost:9000/ocpp/CP001 and connects to it
```

---

## Technical Requirements

| Concern | Decision |
|---------|----------|
| Language | Python 3.9+ |
| WebSocket library | `websockets` (pure Python, minimal) |
| OCPP spec | OCPP 1.6 JSON (not SOAP) |
| Tests | `pytest` + `pytest-asyncio` |
| Entry point | `python simulate.py <url>` or `python simulate.py --mock` |

---

## File Layout

```
05-ocpp-client/
  simulate.py            ← CLI entry point and simulator logic
  ocpp_client.py         ← OCPP message builder and send/receive logic
  mock_cs.py             ← In-process mock Central System (for --mock mode)
  tests/
    test_ocpp_client.py  ← unit tests for message formatting and sequencing
  README.md              ← setup, usage, and OCPP background notes
```

---

## Acceptance Criteria

- [ ] `python simulate.py --mock` completes the full 9-step sequence and exits cleanly
- [ ] All messages logged with direction, action name, and payload
- [ ] `transactionId` from `StartTransaction` response is used in `StopTransaction`
- [ ] Each CALL waits for its matching CALLRESULT before proceeding
- [ ] CALLERROR responses are logged and cause the simulator to exit with a non-zero code
- [ ] `pytest` passes with no errors
- [ ] Tests cover: CALL message format, uniqueId matching, CALLERROR handling
- [ ] README explains the OCPP message types and the session lifecycle

---

## Setup

```bash
cd 05-ocpp-client
pip install websockets pytest pytest-asyncio

# Run against mock CS
python simulate.py --mock

# Run against a real CS
python simulate.py ws://your-cs-host:9000/ocpp/CP001
```

```bash
pytest
```
