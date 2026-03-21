# Charger Not Responding

**Category:** Hardware / Connectivity
**Severity:** High
**Last reviewed:** 2026-03-21

---

## Symptoms

- Customer reports the charger is unresponsive to button presses or RFID tap
- The Virta app shows the charger as "Available" but initiating a session fails
- No LED activity on the charger unit
- Customer receives no feedback (no sounds, no display change)

---

## Possible causes

1. **Power loss at the unit** — breaker tripped, fuse blown, or upstream power issue
2. **Network connectivity lost** — charger cannot reach the Virta backend (OCPP WebSocket disconnected)
3. **Firmware hang** — charger firmware entered an unrecoverable state and requires a reboot
4. **Hardware fault** — internal component failure (contactors, control board)

---

## Diagnostic steps

1. **Check backend status** — log into the Virta operator dashboard and check the charger's last heartbeat timestamp. If the last heartbeat was more than 5 minutes ago, the charger is offline.
2. **Check nearby chargers** — if multiple chargers at the same site are offline, the issue is likely upstream (power or network at the site level, not a single unit).
3. **Ask the customer to inspect the unit** — is the LED completely dark? Any visible damage or vandalism?
4. **Attempt a remote reboot** — if the charger is still reachable (heartbeat recent), trigger a remote reset via the operator dashboard (`Actions → Reset → Soft Reset`).
5. **Check OCPP logs** — look for recent `BootNotification`, `StatusNotification`, or connection errors in the charger logs.

---

## Resolution

| Cause | Action |
|-------|--------|
| Power loss | Ask site operator to check the circuit breaker. If a fuse is blown, a technician visit is needed. |
| Network loss | Ask site operator to check the router/LTE modem at the site. Remote reboot of the charger may restore connectivity once network is back. |
| Firmware hang | Issue a remote soft reset. If that fails, issue a hard reset. If the charger is still unresponsive, escalate. |
| Hardware fault | Escalate to field operations for a technician visit. Do not ask the customer to open or touch the unit. |

---

## Escalation criteria

Escalate to **field operations** if:
- Remote reset has been attempted and the charger remains unresponsive
- The last heartbeat was more than 24 hours ago with no known site outage
- Multiple units at the same site are down (possible electrical or network infrastructure issue)
- There is visible physical damage to the unit

---

## Related articles

- [Charger Shows Available But Offline](./charger-shows-available-but-offline.md)
- [Session Ends Unexpectedly](./session-ends-unexpectedly.md)
