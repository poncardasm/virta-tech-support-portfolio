# EV Charging Session Analysis — Findings Report

**Generated:** 2026-03-21
**Database:** ev_charging (mock dataset, 11 sessions, 5 stations, 5 users)
**Purpose:** Demonstrate SQL-based root-cause investigation for EV charging support scenarios.

---

## 1. Stuck Sessions

Sessions that started but never completed — customer is stranded mid-charge or the session log was never closed.

| Session | Station | Customer | Type | Started | Hours Stuck |
|---------|---------|----------|------|---------|-------------|
| 11 | Vantaa Airport, Bay 2 | Nordic Cars Oy | B2B | 12 days ago | 288.0 |
| 10 | Espoo Mall, Bay 3 | Nordic Cars Oy | B2B | 10 days ago | 240.0 |
| 4 | Espoo Mall, Bay 3 | Liisa Mäkinen | B2C | 2 days ago | 48.1 |
| 6 | Helsinki Central, Bay 1 | Riku Korhonen | B2C | 10 hrs ago | 10.2 |
| 5 | Vantaa Airport, Bay 2 | Pekka Virtanen | B2C | 6 hrs ago | 6.0 |

**Finding:** Espoo Mall Bay 3 and Vantaa Airport Bay 2 account for all stuck sessions. Escalate both stations for hardware inspection.

---

## 2. Payment Failures

| Station | Customer | Method | Failures |
|---------|----------|--------|----------|
| Espoo Mall, Bay 3 | Liisa Mäkinen | card | 1 |
| Espoo Mall, Bay 3 | Nordic Cars Oy | rfid | 1 |
| Vantaa Airport, Bay 2 | Pekka Virtanen | rfid | 1 |
| Vantaa Airport, Bay 2 | Nordic Cars Oy | rfid | 1 |
| Helsinki Central, Bay 1 | Riku Korhonen | app | 1 |

**Finding:** Espoo Mall Bay 3 and Vantaa Airport Bay 2 each show failures from multiple customers — this points to station-side issues rather than individual user problems. Helsinki Central Bay 1 has a single user failure which may be an isolated payment method issue.

---

## 3. Abnormal Session Duration

| Session | Station | Customer | Duration (min) | Flag |
|---------|---------|----------|----------------|------|
| 7 | Helsinki Central, Bay 1 | Liisa Mäkinen | 1.5 | too-short |
| 8 | Tampere Park, Bay 7 | Acme Fleet Oy | 840.0 | too-long |

**Finding:** Session 7 (1.5 min) was likely a hardware disconnect immediately after plug-in. Session 8 (14 hours) was never stopped — possible OCPP `StopTransaction` message lost. Both warrant follow-up with the customers.

---

## 4. Duplicate Charges

| Session | Customer | Email | Payment Count | Total Charged |
|---------|----------|-------|---------------|---------------|
| 9 | Pekka Virtanen | pekka@example.fi | 2 | €20.00 |

**Finding:** Session 9 was charged twice. Initiate a €10.00 refund and investigate whether the duplicate payment was triggered by a client retry without idempotency checks.

---

## 5. Station Reliability (Last 30 Days)

| Station | Connector | Status | Sessions | Incomplete | Failure Rate |
|---------|-----------|--------|----------|------------|--------------|
| Vantaa Airport, Bay 2 | CCS | offline | 2 | 2 | 100.0% |
| Espoo Mall, Bay 3 | Type2 | fault | 2 | 2 | 100.0% |
| Helsinki Central, Bay 1 | CCS | online | 3 | 1 | 33.3% |
| Tampere Park, Bay 7 | CHAdeMO | online | 2 | 0 | 0.0% |
| Turku Harbor, Bay 5 | Type2 | online | 2 | 0 | 0.0% |

**Finding:** Espoo Mall Bay 3 (status: `fault`) and Vantaa Airport Bay 2 (status: `offline`) show 100% failure rates. These should be the top priority for field maintenance. Helsinki Central Bay 1 needs investigation for the 1 incomplete session.

---

## Summary

| Issue | Count | Priority |
|-------|-------|----------|
| Stuck sessions | 5 | High |
| Stations with 100% failure rate | 2 | High |
| Duplicate charges | 1 (€10 overcharge) | High |
| Abnormal durations | 2 | Medium |
| Payment failures | 5 | Medium |
