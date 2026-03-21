-- stuck-sessions.sql
-- Scenario: Sessions that started but never completed.
-- Support use: identify customers stranded mid-charge; check station for fault.

SELECT
    s.id            AS session_id,
    st.location     AS station,
    u.name          AS customer,
    u.customer_type,
    s.started_at,
    EXTRACT(EPOCH FROM (NOW() - s.started_at)) / 3600 AS hours_stuck
FROM sessions s
JOIN stations st ON st.id = s.station_id
JOIN users    u  ON u.id  = s.user_id
WHERE s.ended_at IS NULL
ORDER BY s.started_at ASC;
