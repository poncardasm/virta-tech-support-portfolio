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
