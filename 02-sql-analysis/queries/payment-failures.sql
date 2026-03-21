-- payment-failures.sql
-- Scenario: Payment failures grouped by station and customer.
-- Support use: spot patterns — is it a station config issue or a user's payment method?

SELECT
    st.location          AS station,
    u.name               AS customer,
    u.customer_type,
    p.method,
    COUNT(*)             AS failure_count,
    MAX(p.id)            AS latest_payment_id
FROM payments p
JOIN sessions s  ON s.id  = p.session_id
JOIN stations st ON st.id = s.station_id
JOIN users    u  ON u.id  = s.user_id
WHERE p.status = 'failed'
GROUP BY st.location, u.name, u.customer_type, p.method
ORDER BY failure_count DESC;
