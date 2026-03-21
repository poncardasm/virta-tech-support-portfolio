# Charger Shows Available But Offline

**Category:** Connectivity
**Severity:** Medium
**Last reviewed:** 2026-03-21

---

## Symptoms

- Customer sees the charger as "Available" in the app but cannot start a session
- Session initiation fails silently or with a generic error
- The operator dashboard shows the charger's last heartbeat is stale (more than 5 minutes ago)
- The charger LED may indicate a normal "available" state locally, suggesting the unit itself is powered

---

## Possible causes

1. **OCPP WebSocket connection dropped** — the charger lost its connection to the Virta backend but the app's cached state hasn't updated yet
2. **DNS or routing issue** — the charger can't resolve the Virta backend hostname
3. **Stale app cache** — the customer's app is showing a cached status from before the charger went offline
4. **Firewall or proxy blocking WebSocket traffic** — relevant in enterprise or fleet sites with managed network infrastructure

---

## Diagnostic steps

1. **Check the charger's last heartbeat in the operator dashboard** — if more than 5–10 minutes ago, the OCPP connection is likely broken.
2. **Check if other chargers at the same site are affected** — shared network issue vs single-unit issue.
3. **Ask the customer to refresh the app** — this rules out a stale cache on the customer side.
4. **Check site network status** — if the site has an LTE modem or router, is it online? Can you ping the charger from the management network?
5. **Review OCPP connection logs** — look for repeated `BootNotification` attempts without `Accepted` responses, or WebSocket close events.

---

## Resolution

| Cause | Action |
|-------|--------|
| OCPP connection dropped | Attempt a remote reboot (`Actions → Reset → Soft Reset`). The charger will re-establish the WebSocket on reboot. |
| DNS/routing issue | Coordinate with the site's network admin or the telecom provider managing the charger's connectivity. |
| Stale app cache | Instruct the customer to force-refresh or log out and back in to the app. |
| Firewall blocking WebSocket | Escalate to field ops; the site network configuration needs to be updated to allow outbound WebSocket on port 443 or 80. |

---

## Escalation criteria

Escalate to **field operations** if:
- Remote reboot does not restore the OCPP connection within 10 minutes
- All chargers at a site are unreachable (potential site-level network or power failure)
- The issue is traced to the site's managed network infrastructure (firewall, proxy, VPN)

---

## Related articles

- [Charger Not Responding](./charger-not-responding.md)
- [Session Ends Unexpectedly](./session-ends-unexpectedly.md)
