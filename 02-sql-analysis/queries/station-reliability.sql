-- station-reliability.sql
-- Scenario: Stations ranked by failure rate over the last 30 days.
-- Failure = session that never completed (ended_at IS NULL).
-- Support use: proactive maintenance escalation; SLA reporting.

SELECT
    st.id                                       AS station_id,
    st.location,
    st.connector,
    st.status,
    COUNT(s.id)                                 AS total_sessions,
    COUNT(s.id) FILTER (WHERE s.ended_at IS NULL) AS incomplete_sessions,
    ROUND(
        100.0 * COUNT(s.id) FILTER (WHERE s.ended_at IS NULL) / NULLIF(COUNT(s.id), 0),
        1
    )                                           AS failure_rate_pct
FROM stations st
LEFT JOIN sessions s
    ON s.station_id = st.id
    AND s.started_at >= NOW() - INTERVAL '30 days'
GROUP BY st.id, st.location, st.connector, st.status
ORDER BY failure_rate_pct DESC NULLS LAST;
