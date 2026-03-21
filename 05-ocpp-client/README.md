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
