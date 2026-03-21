# Session Ends Unexpectedly

**Category:** Session Handling
**Severity:** High
**Last reviewed:** 2026-03-21

---

## Symptoms

- Customer reports their charging session stopped before the vehicle was fully charged
- The app shows the session as completed but the customer did not initiate a stop
- Vehicle is no longer charging despite being plugged in
- The customer may have received a session-end notification unexpectedly

---

## Possible causes

1. **Charger-side stop** — the charger stopped the session due to an error (overcurrent, temperature fault, ground fault detection)
2. **Backend-initiated stop** — a scheduled session limit, cost cap, or idle fee policy ended the session
3. **OCPP connection loss mid-session** — if the charger loses its backend connection and is configured to stop sessions on disconnect, the session ends
4. **Vehicle-side stop** — the vehicle's BMS (battery management system) or a cable unplug ended the session
5. **Concurrent session conflict** — a new authorization event on the same charger caused the current session to be stopped

---

## Diagnostic steps

1. **Find the session in the operator dashboard** — check the stop reason field. OCPP stop reasons include: `Local`, `Remote`, `PowerLoss`, `EVDisconnected`, `DeAuthorized`, `Other`.
2. **Check the stop reason**:
   - `EVDisconnected` → the cable was unplugged or the vehicle ended the session
   - `Remote` → the session was stopped by the Virta backend (check for cost cap or time limit)
   - `Local` → the session was stopped at the charger (hardware event or button press)
   - `PowerLoss` or `Other` → investigate charger logs for fault events
3. **Check for fault events** in the charger's OCPP `StatusNotification` messages around the session end time.
4. **Check if a session cost cap or time limit is configured** on the customer's account or the tariff.
5. **Check the session energy and duration** — does it match what the vehicle's dashboard shows? Discrepancy suggests a measurement or sync issue.

---

## Resolution

| Stop reason | Action |
|-------------|--------|
| `EVDisconnected` | Inform the customer the vehicle or cable ended the session. No fault on the charger side. |
| `Remote` (cost or time cap) | Explain the configured limit. If the customer didn't set it, check if it's a tariff rule and escalate if it shouldn't apply. |
| `Local` (hardware fault) | Check for fault codes in the OCPP logs. Escalate to field ops if a hardware fault is confirmed. |
| `PowerLoss` | Check site power status. Escalate to field ops if the outage was unplanned. |
| `Other` with no clear cause | Escalate for log review — a support engineer should inspect the raw OCPP message sequence. |

---

## Escalation criteria

Escalate to **field operations** if:
- Stop reason indicates a hardware fault (overcurrent, ground fault, temperature)
- The charger is repeatedly ending sessions at the same point (pattern suggests a hardware issue)
- The energy billed differs significantly from the vehicle's reported energy received

Escalate to **billing operations** if:
- The session ended due to a cost cap that the customer disputes
- The customer was billed for a session that ended before the vehicle was charged

---

## Related articles

- [Charger Not Responding](./charger-not-responding.md)
- [Payment Declined But Session Started](./payment-declined-session-started.md)
- [Charger Shows Available But Offline](./charger-shows-available-but-offline.md)
