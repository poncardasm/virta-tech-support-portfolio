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
