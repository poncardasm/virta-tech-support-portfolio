-- duplicate-charges.sql
-- Scenario: Users charged more than once for the same session.
-- Support use: billing dispute resolution; trigger refund process.

SELECT
    p.session_id,
    u.name          AS customer,
    u.email,
    COUNT(p.id)     AS payment_count,
    SUM(p.amount_eur) AS total_charged_eur
FROM payments p
JOIN sessions s ON s.id = p.session_id
JOIN users    u ON u.id = s.user_id
WHERE p.status = 'success'
GROUP BY p.session_id, u.name, u.email
HAVING COUNT(p.id) > 1
ORDER BY payment_count DESC;
