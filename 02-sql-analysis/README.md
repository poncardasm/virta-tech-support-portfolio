# 02 — EV Charging Session SQL Analysis

A mock PostgreSQL database of EV charging sessions, users, stations, and payment events. The queries answer real support investigation scenarios — the kind of root-cause analysis a Technical Support Specialist does daily.

## Why This Exists

SQL is listed as an advantage in the Virta Technical Support Specialist role. This project shows I can write targeted queries to investigate customer issues: stuck sessions, billing errors, hardware faults, and station reliability.

## Schema

| Table | Purpose |
|-------|---------|
| `stations` | Charging station metadata: location, connector type, status |
| `users` | Customer accounts: B2B and B2C |
| `sessions` | Charging session records: start time, end time, energy delivered |
| `payments` | Payment events per session: amount, status, payment method |

## Queries

| File | Investigation Scenario |
|------|----------------------|
| `queries/stuck-sessions.sql` | Sessions that started but never completed |
| `queries/payment-failures.sql` | Payment failures grouped by station and user |
| `queries/abnormal-session-duration.sql` | Sessions outside expected duration (hardware fault signal) |
| `queries/duplicate-charges.sql` | Users charged more than once for the same session |
| `queries/station-reliability.sql` | Stations ranked by failure rate over the last 30 days |

## Setup

**Requirements:** PostgreSQL 14+

```bash
# Clone and enter the project directory
cd 02-sql-analysis

# Create the database
createdb ev_charging

# Load schema and seed data
psql -d ev_charging -f schema.sql
psql -d ev_charging -f seed.sql

# Run any query
psql -d ev_charging -f queries/stuck-sessions.sql
```

## Findings

See [`report/findings.md`](report/findings.md) for a complete analysis of the mock dataset results — written as a summary you would share with a support team lead.

## SQLite Note

The queries use standard SQL and are compatible with SQLite with one change: replace `NOW() - INTERVAL 'X days'` with `datetime('now', '-X days')` and `EXTRACT(EPOCH FROM ...)` with `strftime('%s', ...)`.
