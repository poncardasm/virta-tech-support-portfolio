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
