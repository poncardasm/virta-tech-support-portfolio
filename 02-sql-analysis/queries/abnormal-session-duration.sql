-- abnormal-session-duration.sql
-- Scenario: Sessions outside expected duration (2 min – 12 hours).
-- Support use: very short = possible hardware disconnect; very long = session not stopped.

WITH session_durations AS (
    SELECT
        s.id            AS session_id,
        st.location     AS station,
        u.name          AS customer,
        s.started_at,
        s.ended_at,
        EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) AS duration_seconds
    FROM sessions s
    JOIN stations st ON st.id = s.station_id
    JOIN users    u  ON u.id  = s.user_id
    WHERE s.ended_at IS NOT NULL
)
SELECT
    session_id,
    station,
    customer,
    started_at,
    ended_at,
    ROUND(duration_seconds / 60, 1) AS duration_minutes,
    CASE
        WHEN duration_seconds < 120   THEN 'too-short'
        WHEN duration_seconds > 43200 THEN 'too-long'
    END                             AS flag
FROM session_durations
WHERE duration_seconds < 120
   OR duration_seconds > 43200
ORDER BY duration_minutes ASC;
