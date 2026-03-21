# RFID Card Not Recognized

**Category:** Authentication
**Severity:** Medium
**Last reviewed:** 2026-03-21

---

## Symptoms

- Customer taps their RFID card or fob on the charger and nothing happens
- Charger LED flashes red or shows a "card not authorized" indicator
- Customer receives a push notification saying their card was rejected
- Customer previously used the same card successfully at other sites

---

## Possible causes

1. **Card not registered in the Virta system** — the card's UID is not linked to an active user account
2. **Card registered but authorization list not synced to the charger** — the charger's local authorization cache is stale
3. **Card registered to a different CPO's network** — the card is valid elsewhere but not whitelisted for this operator
4. **Card physically damaged or wrong frequency** — the card is not transmitting its UID correctly
5. **Charger in "offline authorization" mode** — the charger is offline and its local whitelist doesn't include this card

---

## Diagnostic steps

1. **Look up the card UID in the Virta backend** — is it linked to an active account? Check account status (active, suspended, payment overdue).
2. **Check the charger's authorization mode** — is it set to `online` (check every tap with the backend) or `local` (use a cached list)?
3. **If local mode, check when the authorization list was last synced** — a stale list may not include recently added cards.
4. **Try a remote `SendLocalList` command** to push an updated authorization list to the charger.
5. **Ask the customer to try starting a session via the app instead** — this rules out a card-specific hardware issue.
6. **Check if the card works at another charger on the same network** — isolates charger vs card vs account.

---

## Resolution

| Cause | Action |
|-------|--------|
| Card not registered | Guide the customer to register the card in the app under Account → Cards → Add Card. |
| Stale authorization list | Trigger `SendLocalList` from the operator dashboard to push the updated list to the charger. |
| Wrong network | Explain roaming limitations. If the customer expects roaming access, escalate to the accounts team. |
| Physical card damage | Advise the customer to request a replacement card or use the app to start sessions. |
| Charger offline + local list miss | The customer must use the app (remote start) or wait until the charger reconnects. |

---

## Escalation criteria

Escalate to **accounts / identity team** if:
- Card UID is registered and active, but authorization still fails after `SendLocalList`
- Account is in a suspended or payment-overdue state that requires manual review
- Customer is a B2B fleet operator reporting multiple cards failing across a site

---

## Related articles

- [Charger Shows Available But Offline](./charger-shows-available-but-offline.md)
- [Session Ends Unexpectedly](./session-ends-unexpectedly.md)
