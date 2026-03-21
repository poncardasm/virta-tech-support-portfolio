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
