-- abnormal-session-duration.sql
-- Scenario: Sessions outside expected duration (2 min – 12 hours).
-- Support use: very short = possible hardware disconnect; very long = session not stopped.

SELECT
    s.id                AS session_id,
    st.location         AS station,
    u.name              AS customer,
    s.started_at,
    s.ended_at,
    ROUND(
        EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) / 60, 1
    )                   AS duration_minutes,
    CASE
        WHEN EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) < 120    THEN 'too-short'
        WHEN EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) > 43200  THEN 'too-long'
    END                 AS flag
FROM sessions s
JOIN stations st ON st.id = s.station_id
JOIN users    u  ON u.id  = s.user_id
WHERE s.ended_at IS NOT NULL
  AND (
      EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) < 120
   OR EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) > 43200
  )
ORDER BY duration_minutes ASC;
