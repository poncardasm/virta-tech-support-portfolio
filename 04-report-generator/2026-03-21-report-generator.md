# Report Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Python CLI script that reads a CSV of raw support ticket data and produces a formatted weekly Markdown summary report, demonstrating process automation and pattern-identification skills for the Virta Technical Support Specialist role.

**Architecture:** Single Python script (`generate_report.py`) using stdlib only. Reads CSV input, computes metrics, writes Markdown to stdout or file. A `sample_data.csv` fixture provides demo data. Tests live in `tests/test_report.py` and use `pytest`.

**Tech Stack:** Python 3.9+, stdlib (`csv`, `argparse`, `datetime`, `collections`), `pytest` for tests.

---

## File Map

```
04-report-generator/
  generate_report.py     ← CLI entry point and all logic
  sample_data.csv        ← 30-row demo CSV
  tests/
    test_report.py       ← pytest unit tests
  README.md              ← setup and usage instructions
  PRD.md                 ← product requirements (already exists)
```

---

## Task 1: Sample Data

**Files:**
- Create: `04-report-generator/sample_data.csv`

- [ ] **Step 1: Write sample_data.csv**

30 rows covering all statuses, priorities, categories, and customer types. Include a mix of resolved (with `resolved_at`) and open (empty `resolved_at`) tickets. Several resolved tickets should exceed 24h to trigger SLA breach logic.

```
ticket_id,title,status,priority,category,customer_type,created_at,resolved_at
1,Charger not starting,resolved,high,technical,B2C,2026-03-15T08:00:00,2026-03-15T09:30:00
2,Payment failed at station 12,resolved,high,billing,B2C,2026-03-15T09:00:00,2026-03-16T10:00:00
3,Fleet invoice discrepancy,resolved,medium,billing,B2B,2026-03-15T10:00:00,2026-03-17T11:00:00
4,Station offline - site A,escalated,high,technical,B2B,2026-03-15T11:00:00,
5,App login issue,resolved,low,account,B2C,2026-03-15T12:00:00,2026-03-15T14:00:00
6,Charging session stuck,resolved,high,technical,B2C,2026-03-15T13:00:00,2026-03-15T15:00:00
7,Card reader not responding,open,medium,device,B2C,2026-03-15T14:00:00,
8,RFID card not recognised,resolved,medium,account,B2B,2026-03-15T15:00:00,2026-03-15T18:00:00
9,Double charge on session,resolved,high,billing,B2C,2026-03-15T16:00:00,2026-03-16T08:00:00
10,Cable lock stuck,resolved,low,device,B2C,2026-03-15T17:00:00,2026-03-15T20:00:00
11,Fleet API integration error,in-progress,high,technical,B2B,2026-03-16T08:00:00,
12,Session did not stop,resolved,medium,technical,B2C,2026-03-16T09:00:00,2026-03-16T11:30:00
13,Billing address update,resolved,low,account,B2C,2026-03-16T10:00:00,2026-03-16T11:00:00
14,Station power fault,escalated,high,device,B2B,2026-03-16T11:00:00,
15,OCPP connection dropping,resolved,high,technical,B2B,2026-03-16T12:00:00,2026-03-18T14:00:00
16,Refund not received,resolved,medium,billing,B2C,2026-03-16T13:00:00,2026-03-17T09:00:00
17,Wrong kWh billed,resolved,high,billing,B2B,2026-03-16T14:00:00,2026-03-16T16:00:00
18,Screen blank on charger,open,low,device,B2C,2026-03-16T15:00:00,
19,Account locked out,resolved,medium,account,B2C,2026-03-16T16:00:00,2026-03-16T17:30:00
20,Session not starting,resolved,high,technical,B2C,2026-03-17T08:00:00,2026-03-17T10:00:00
21,Fleet roaming issue,in-progress,medium,technical,B2B,2026-03-17T09:00:00,
22,Payment timeout,resolved,medium,billing,B2C,2026-03-17T10:00:00,2026-03-17T12:00:00
23,Charger unreachable,resolved,high,technical,B2B,2026-03-17T11:00:00,2026-03-19T09:00:00
24,RFID provisioning delay,open,low,account,B2B,2026-03-17T12:00:00,
25,Connector stuck in locked,resolved,medium,device,B2C,2026-03-17T13:00:00,2026-03-17T15:00:00
26,Invoice not generated,resolved,high,billing,B2B,2026-03-18T08:00:00,2026-03-18T10:00:00
27,App shows wrong balance,open,low,billing,B2C,2026-03-18T09:00:00,
28,Station firmware update failed,escalated,high,technical,B2B,2026-03-18T10:00:00,
29,Charge point ID conflict,resolved,medium,technical,B2B,2026-03-18T11:00:00,2026-03-18T14:00:00
30,User cannot add payment method,resolved,low,account,B2C,2026-03-18T12:00:00,2026-03-18T13:30:00
```

- [ ] **Step 2: Commit**

```bash
git add 04-report-generator/sample_data.csv
git commit -m "feat(report): add 30-row sample ticket CSV"
```

---

## Task 2: Core Script

**Files:**
- Create: `04-report-generator/generate_report.py`

- [ ] **Step 1: Write generate_report.py**

The script has three sections: argument parsing, metric computation, and report rendering.

```python
#!/usr/bin/env python3
"""Weekly support report generator — reads a ticket CSV, outputs Markdown."""

import argparse
import csv
import sys
from collections import Counter
from datetime import datetime


TIMESTAMP_FMT = "%Y-%m-%dT%H:%M:%S"


def parse_args():
    parser = argparse.ArgumentParser(
        description="Generate a weekly support report from a ticket CSV."
    )
    parser.add_argument("input", help="Path to input CSV file")
    parser.add_argument(
        "--output", default=None, help="Path to write Markdown report (default: stdout)"
    )
    parser.add_argument(
        "--sla-hours", type=float, default=24.0,
        help="SLA threshold in hours (default: 24)"
    )
    parser.add_argument(
        "--week", default=None,
        help="Week label for report header (default: auto-derived from data)"
    )
    return parser.parse_args()


def load_tickets(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def compute_metrics(tickets, sla_hours):
    total = len(tickets)
    resolved = [t for t in tickets if t["status"] == "resolved"]
    unresolved = [t for t in tickets if t["status"] != "resolved"]
    escalated = [t for t in tickets if t["status"] == "escalated"]

    resolution_times = []
    sla_breaches = 0
    for t in resolved:
        if t.get("resolved_at"):
            created = datetime.strptime(t["created_at"], TIMESTAMP_FMT)
            resolved_at = datetime.strptime(t["resolved_at"], TIMESTAMP_FMT)
            hours = (resolved_at - created).total_seconds() / 3600
            resolution_times.append(hours)
            if hours > sla_hours:
                sla_breaches += 1

    avg_resolution = (
        sum(resolution_times) / len(resolution_times) if resolution_times else None
    )

    categories = Counter(t["category"] for t in tickets)
    priorities = Counter(t["priority"] for t in tickets)
    customer_types = Counter(t["customer_type"] for t in tickets)

    return {
        "total": total,
        "resolved_count": len(resolved),
        "unresolved_count": len(unresolved),
        "escalated_count": len(escalated),
        "avg_resolution_hours": avg_resolution,
        "sla_breaches": sla_breaches,
        "categories": categories,
        "priorities": priorities,
        "customer_types": customer_types,
    }


def pct(count, total):
    return f"{count / total * 100:.0f}%" if total else "0%"


def freq_table(counter, total):
    rows = []
    for key, count in counter.most_common():
        rows.append(f"| {key} | {count} | {pct(count, total)} |")
    return rows


def derive_week_label(tickets):
    dates = []
    for t in tickets:
        try:
            dates.append(datetime.strptime(t["created_at"], TIMESTAMP_FMT))
        except (ValueError, KeyError):
            pass
    if not dates:
        return "Unknown"
    min_date = min(dates).strftime("%Y-%m-%d")
    max_date = max(dates).strftime("%Y-%m-%d")
    return f"{min_date} to {max_date}"


def render_report(metrics, week_label, sla_hours):
    m = metrics
    avg = f"{m['avg_resolution_hours']:.1f}h" if m["avg_resolution_hours"] is not None else "N/A"

    lines = [
        f"# Weekly Support Report — {week_label}",
        "",
        "## Summary",
        f"- Total tickets: {m['total']}",
        f"- Resolved: {m['resolved_count']}",
        f"- Open / In-progress / Escalated: {m['unresolved_count']}",
        f"- Escalated: {m['escalated_count']}",
        f"- Avg resolution time: {avg}",
        f"- SLA breaches (>{sla_hours:.0f}h): {m['sla_breaches']}",
        "",
        "## Tickets by Category",
        "| Category | Count | % |",
        "|----------|-------|---|",
        *freq_table(m["categories"], m["total"]),
        "",
        "## Tickets by Priority",
        "| Priority | Count | % |",
        "|----------|-------|---|",
        *freq_table(m["priorities"], m["total"]),
        "",
        "## Customer Type",
        "| Type | Count | % |",
        "|------|-------|---|",
        *freq_table(m["customer_types"], m["total"]),
    ]
    return "\n".join(lines) + "\n"


def main():
    args = parse_args()
    tickets = load_tickets(args.input)
    metrics = compute_metrics(tickets, args.sla_hours)
    week_label = args.week or derive_week_label(tickets)
    report = render_report(metrics, week_label, args.sla_hours)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(report)
    else:
        sys.stdout.write(report)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Smoke test**

```bash
cd 04-report-generator
python generate_report.py sample_data.csv
```

Expected: A Markdown report printed to stdout with correct counts.

- [ ] **Step 3: Commit**

```bash
git add 04-report-generator/generate_report.py
git commit -m "feat(report): add report generator script"
```

---

## Task 3: Tests

**Files:**
- Create: `04-report-generator/tests/__init__.py`
- Create: `04-report-generator/tests/test_report.py`

- [ ] **Step 1: Write tests/test_report.py**

```python
import pytest
from generate_report import compute_metrics, render_report, derive_week_label


RESOLVED_FAST = {
    "ticket_id": "1", "title": "Test", "status": "resolved",
    "priority": "high", "category": "technical", "customer_type": "B2C",
    "created_at": "2026-03-15T08:00:00", "resolved_at": "2026-03-15T10:00:00",
}

RESOLVED_SLOW = {
    "ticket_id": "2", "title": "Slow", "status": "resolved",
    "priority": "medium", "category": "billing", "customer_type": "B2B",
    "created_at": "2026-03-15T08:00:00", "resolved_at": "2026-03-16T10:00:00",
}

OPEN_TICKET = {
    "ticket_id": "3", "title": "Open", "status": "open",
    "priority": "low", "category": "account", "customer_type": "B2C",
    "created_at": "2026-03-15T09:00:00", "resolved_at": "",
}

ESCALATED_TICKET = {
    "ticket_id": "4", "title": "Escalated", "status": "escalated",
    "priority": "high", "category": "device", "customer_type": "B2B",
    "created_at": "2026-03-15T10:00:00", "resolved_at": "",
}


def test_total_count():
    metrics = compute_metrics([RESOLVED_FAST, OPEN_TICKET], sla_hours=24)
    assert metrics["total"] == 2


def test_resolved_vs_unresolved():
    metrics = compute_metrics([RESOLVED_FAST, OPEN_TICKET, ESCALATED_TICKET], sla_hours=24)
    assert metrics["resolved_count"] == 1
    assert metrics["unresolved_count"] == 2


def test_escalated_count():
    metrics = compute_metrics([RESOLVED_FAST, ESCALATED_TICKET], sla_hours=24)
    assert metrics["escalated_count"] == 1


def test_avg_resolution_time():
    metrics = compute_metrics([RESOLVED_FAST], sla_hours=24)
    assert metrics["avg_resolution_hours"] == pytest.approx(2.0)


def test_sla_breach():
    # RESOLVED_SLOW took 26h — breaches 24h SLA
    metrics = compute_metrics([RESOLVED_FAST, RESOLVED_SLOW], sla_hours=24)
    assert metrics["sla_breaches"] == 1


def test_sla_no_breach_with_higher_threshold():
    metrics = compute_metrics([RESOLVED_SLOW], sla_hours=48)
    assert metrics["sla_breaches"] == 0


def test_all_open_no_avg():
    metrics = compute_metrics([OPEN_TICKET], sla_hours=24)
    assert metrics["avg_resolution_hours"] is None
    assert metrics["sla_breaches"] == 0


def test_empty_input():
    metrics = compute_metrics([], sla_hours=24)
    assert metrics["total"] == 0
    assert metrics["resolved_count"] == 0
    assert metrics["avg_resolution_hours"] is None


def test_missing_resolved_at_excluded():
    metrics = compute_metrics([OPEN_TICKET], sla_hours=24)
    assert metrics["avg_resolution_hours"] is None


def test_category_counter():
    metrics = compute_metrics([RESOLVED_FAST, OPEN_TICKET], sla_hours=24)
    assert metrics["categories"]["technical"] == 1
    assert metrics["categories"]["account"] == 1


def test_derive_week_label():
    tickets = [RESOLVED_FAST, RESOLVED_SLOW]
    label = derive_week_label(tickets)
    assert label == "2026-03-15 to 2026-03-15"


def test_render_report_contains_header():
    metrics = compute_metrics([RESOLVED_FAST], sla_hours=24)
    report = render_report(metrics, "2026-03-15 to 2026-03-21", 24)
    assert "# Weekly Support Report" in report
    assert "2026-03-15 to 2026-03-21" in report


def test_render_report_sla_line():
    metrics = compute_metrics([RESOLVED_SLOW], sla_hours=24)
    report = render_report(metrics, "Week", 24)
    assert "SLA breaches" in report
    assert ">24h" in report
```

- [ ] **Step 2: Create tests/__init__.py** (empty file)

- [ ] **Step 3: Run tests**

```bash
cd 04-report-generator
pip install pytest
pytest
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add 04-report-generator/tests/
git commit -m "feat(report): add pytest test suite"
```

---

## Task 4: README

**Files:**
- Create: `04-report-generator/README.md`

- [ ] **Step 1: Write README.md**

```markdown
# Weekly Support Report Generator

A Python CLI script that reads a CSV of raw support ticket data and produces a formatted weekly summary in Markdown.

## Usage

```bash
# Print report to stdout
python generate_report.py sample_data.csv

# Write report to a file
python generate_report.py sample_data.csv --output report.md

# Change the SLA threshold (default: 24h)
python generate_report.py sample_data.csv --sla-hours 48

# Set a custom week label
python generate_report.py sample_data.csv --week "2026-03-15 to 2026-03-21"
```

## Input CSV Format

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

See `sample_data.csv` for a 30-row example.

## Requirements

- Python 3.9+
- No external dependencies for the script itself

## Running Tests

```bash
pip install pytest
pytest
```
```

- [ ] **Step 2: Commit**

```bash
git add 04-report-generator/README.md
git commit -m "docs(report): add README with usage instructions"
```

---

## Task 5: Final Verification

- [ ] `python generate_report.py sample_data.csv` prints valid Markdown
- [ ] `python generate_report.py sample_data.csv --output report.md` creates file
- [ ] `python generate_report.py sample_data.csv --sla-hours 48` changes SLA line
- [ ] `pytest` passes with no failures
