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
