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
