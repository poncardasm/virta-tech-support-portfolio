# Slow Charging Speed

**Category:** Session Handling / Hardware
**Severity:** Medium
**Last reviewed:** 2026-03-21

---

## Symptoms

- Customer reports the car is charging slower than expected
- App shows a low power output (kW) for the session
- Estimated time to full charge is much higher than usual
- Customer has charged at the same station before at higher speeds

---

## Possible causes

1. **Vehicle-side limiting** — the vehicle's BMS is accepting less power than the charger can supply (common when battery is nearly full, very hot, or very cold)
2. **Charger configured below max output** — the operator has set a power cap on the charger or circuit
3. **Load balancing** — the site uses dynamic load management; multiple active sessions reduce per-charger output
4. **Cable or connector issue** — a degraded cable limits current delivery
5. **AC charger limitation** — the customer may be using a slower AC station and expecting DC fast-charge speeds

---

## Diagnostic steps

1. **Check the session's real-time power in the operator dashboard** — what is the actual kW delivery?
2. **Check the charger's max configured output** — has a power cap been set by the operator?
3. **Check other active sessions on the same site** — is load balancing reducing output?
4. **Ask the customer what speed they expected and why** — are they comparing to a DC fast charger they used before?
5. **Check the vehicle model** — some vehicles have lower on-board charger limits (e.g., 7.4 kW max AC). This is a vehicle spec, not a charger fault.
6. **Check ambient temperature** — extreme cold or heat reduces battery acceptance rate.

---

## Resolution

| Cause | Action |
|-------|--------|
| Vehicle BMS limiting | Explain to the customer that the vehicle is controlling the charge rate. This is normal behavior near full charge or in extreme temperatures. |
| Operator power cap | If the cap is incorrect, escalate to the site operator or the accounts team to review the configuration. |
| Load balancing | Explain that the site distributes power across active sessions. If the customer needs faster charging, they should use a DC fast charger. |
| Cable/connector degradation | Escalate to field ops for inspection. |
| AC vs DC confusion | Educate the customer on the difference between AC and DC charging. Link them to the help center article on charger types. |

---

## Escalation criteria

Escalate to **field operations** if:
- The charger's reported output is significantly below its rated max with no load balancing explanation
- The cable or connector is suspected to be degraded
- Multiple customers at the same site report slow charging (possible electrical supply issue)

---

## Related articles

- [Session Ends Unexpectedly](./session-ends-unexpectedly.md)
- [Charger Not Responding](./charger-not-responding.md)
