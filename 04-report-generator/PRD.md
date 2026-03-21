# Product Requirements Document — Weekly Support Report Generator

**Project:** 04 — Weekly Support Report Generator
**Portfolio:** Virta Technical Support Specialist
**Status:** Ready for implementation

---

## Overview

A Python CLI script that reads a CSV of raw support ticket data and produces a formatted weekly summary report in Markdown. The goal is to demonstrate process improvement thinking, the ability to surface patterns from support data, and practical scripting for operational tasks.

---

## Problem Statement

Support teams accumulate ticket data across the week but rarely have time to manually compile it into a coherent summary. A report that surfaces resolution times, SLA breaches, issue category trends, and open/closed ratios gives team leads and support managers the visibility they need to prioritise resources, flag recurring issues, and communicate status to other teams.

---

## Goals

- Demonstrate ability to automate a routine operational task with a script
- Show pattern-identification thinking (category trends, SLA breaches, priority spread)
- Produce clean, readable output suitable for sharing with a team
- Keep the tool simple and dependency-free — runnable without a virtualenv or install step

---

## Non-Goals

- Real database or API integration
- Interactive UI or web interface
- Email delivery or scheduling
- Multi-week trend analysis
- Configurable output formats (PDF, HTML)

---

## Users

| User | Description |
|------|-------------|
| Support Specialist / Team Lead | Runs the script weekly to produce a summary for the team or management |

Single user type, no auth, no roles. Portfolio demo only.

---

## Features

### 1. CSV Input

Accepts a CSV file path as a positional CLI argument. Expected columns:

| Column | Type | Notes |
|--------|------|-------|
| `ticket_id` | Integer | Unique identifier |
| `title` | Text | Ticket title |
| `status` | Enum | `open` · `in-progress` · `escalated` · `resolved` |
| `priority` | Enum | `low` · `medium` · `high` |
| `category` | Enum | `billing` · `technical` · `device` · `account` |
| `customer_type` | Enum | `B2B` · `B2C` |
| `created_at` | ISO 8601 | e.g. `2026-03-15T09:30:00` |
| `resolved_at` | ISO 8601 or empty | Empty for unresolved tickets |

### 2. Metrics Computed

| Metric | Description |
|--------|-------------|
| Total tickets | Count of all rows in the input |
| Open vs resolved | Count of `open`/`in-progress`/`escalated` vs `resolved` |
| Avg resolution time | Mean of `resolved_at − created_at` for resolved tickets, in hours |
| SLA breach count | Resolved tickets where resolution time exceeded the SLA threshold (default 24h) |
| Top issue categories | Frequency table of `category` values, descending |
| Priority breakdown | Count per priority level |
| B2B vs B2C split | Count per customer type |
| Escalated tickets | Count of tickets with status `escalated` |

### 3. CLI Interface

```
usage: generate_report.py [-h] [--output OUTPUT] [--sla-hours SLA_HOURS] [--week WEEK] input

positional arguments:
  input                 Path to input CSV file

optional arguments:
  --output OUTPUT       Path to write the Markdown report (default: stdout)
  --sla-hours SLA_HOURS SLA threshold in hours (default: 24)
  --week WEEK           Week label shown in the report header (default: auto-derived from data)
```

### 4. Markdown Output

The report is written to stdout or a file. Structure:

```
# Weekly Support Report — <week label>

## Summary
- Total tickets: N
- Open / In-progress / Escalated: N
- Resolved: N
- Avg resolution time: N.Nh
- SLA breaches (>Nh): N
- Escalated: N

## Tickets by Category
| Category  | Count | % |
...

## Tickets by Priority
| Priority | Count | % |
...

## Customer Type
| Type | Count | % |
...
```

---

## Technical Requirements

| Concern | Decision |
|---------|----------|
| Language | Python 3.9+ |
| Dependencies | stdlib only (`csv`, `argparse`, `datetime`, `collections`) |
| Tests | `pytest` (dev dependency only) |
| Entry point | `python generate_report.py <input.csv>` |
| No build step | Script runs directly — no virtualenv required for normal use |

---

## File Layout

```
04-report-generator/
  generate_report.py     ← CLI entry point and all logic
  sample_data.csv        ← 30-row demo CSV covering all categories and statuses
  tests/
    test_report.py       ← pytest unit tests
  README.md              ← setup and usage instructions
```

---

## Acceptance Criteria

- [ ] `python generate_report.py sample_data.csv` prints a valid Markdown report to stdout
- [ ] `--output report.md` writes the report to a file instead
- [ ] `--sla-hours 48` changes the SLA breach threshold
- [ ] All metrics are correct against the sample data (manually verified)
- [ ] Empty `resolved_at` rows are excluded from resolution time and SLA calculations
- [ ] Report includes correct percentages in category, priority, and customer type tables
- [ ] `pytest` passes with no errors
- [ ] Tests cover: normal run, SLA breach logic, all-open input, empty input, missing `resolved_at`

---

## Setup

```bash
cd 04-report-generator
python generate_report.py sample_data.csv
```

```bash
# Run tests (requires pytest)
pip install pytest
pytest
```
