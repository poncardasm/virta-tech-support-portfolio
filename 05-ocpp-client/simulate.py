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
