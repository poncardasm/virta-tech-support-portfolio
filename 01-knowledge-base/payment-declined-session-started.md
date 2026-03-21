# Payment Declined But Session Started

**Category:** Billing
**Severity:** High
**Last reviewed:** 2026-03-21

---

## Symptoms

- Customer reports their card was declined, but a charging session started anyway
- Customer is unsure if they will be charged
- Session shows as active or completed in the app despite the payment failure message
- Customer may have received a card decline notification from their bank

---

## Possible causes

1. **Pre-authorization hold failed, but session started due to a race condition** — the charger received a start command before the payment gateway returned a decline
2. **Offline authorization mode** — the charger was configured to allow sessions to start while offline, deferring payment
3. **Billing retry logic** — the session was started on a retry path; the customer will be charged later if the card succeeds on retry
4. **Payment gateway timeout** — the gateway timed out, the session was allowed to start as a fallback, and the charge will be attempted at session end

---

## Diagnostic steps

1. **Find the session in the operator dashboard** — look up the session by the customer's account or the charger ID and timestamp.
2. **Check the payment status** — is it `pending`, `failed`, `retrying`, or `void`?
3. **Check if the customer was actually charged** — look at transaction records. A `pending` state means the charge hasn't settled yet.
4. **Check the charger's payment mode setting** — is offline authorization enabled on this unit?
5. **Check for a retry in progress** — the billing system may be queued to retry the charge.

---

## Resolution

| Status | Action |
|--------|--------|
| Payment `pending` | Inform the customer the charge is pending and will settle within 1–3 business days. No action needed yet. |
| Payment `failed`, session completed | Check if a retry is scheduled. If not, the session may need to be voided. Escalate to billing team. |
| Payment `failed`, session still active | Do not stop the session manually without confirming with billing first. Escalate. |
| Offline auth enabled | Explain to the customer that the site allows sessions to start offline; payment is collected at session end or via retry. |

---

## Escalation criteria

Escalate to **billing operations** if:
- Payment status is `failed` with no retry scheduled and the session has completed
- Customer is reporting a duplicate charge (charge appeared despite the decline)
- The session cannot be reconciled in the system (no matching transaction record)

---

## Related articles

- [Session Ends Unexpectedly](./session-ends-unexpectedly.md)
