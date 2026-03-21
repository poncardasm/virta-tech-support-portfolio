-- seed.sql
-- Stations
INSERT INTO stations (location, connector, status) VALUES
  ('Helsinki Central, Bay 1', 'CCS', 'online'),
  ('Espoo Mall, Bay 3',       'Type2', 'fault'),
  ('Tampere Park, Bay 7',     'CHAdeMO', 'online'),
  ('Vantaa Airport, Bay 2',   'CCS', 'offline'),
  ('Turku Harbor, Bay 5',     'Type2', 'online');

-- Users
INSERT INTO users (name, customer_type, email) VALUES
  ('Liisa Mäkinen',  'B2C', 'liisa@example.fi'),
  ('Pekka Virtanen', 'B2C', 'pekka@example.fi'),
  ('Acme Fleet Oy',  'B2B', 'fleet@acme.fi'),
  ('Riku Korhonen',  'B2C', 'riku@example.fi'),
  ('Nordic Cars Oy', 'B2B', 'ops@nordiccars.fi');

-- Sessions (id 1-11)
INSERT INTO sessions (station_id, user_id, started_at, ended_at, energy_kwh) VALUES
  -- normal completed sessions
  (1, 1, NOW() - INTERVAL '5 days' - INTERVAL '2 hours', NOW() - INTERVAL '5 days', 22.4),
  (3, 2, NOW() - INTERVAL '4 days' - INTERVAL '1 hour',  NOW() - INTERVAL '4 days', 18.0),
  (5, 3, NOW() - INTERVAL '3 days' - INTERVAL '90 minutes',  NOW() - INTERVAL '3 days', 30.0),

  -- stuck sessions (no ended_at)
  (2, 1, NOW() - INTERVAL '2 days', NULL, NULL),
  (4, 2, NOW() - INTERVAL '6 hours', NULL, NULL),
  (1, 4, NOW() - INTERVAL '10 hours', NULL, NULL),

  -- abnormally short session (< 2 minutes)
  (1, 1, NOW() - INTERVAL '1 day' - INTERVAL '90 seconds', NOW() - INTERVAL '1 day', 0.1),

  -- abnormally long session (> 12 hours)
  (3, 3, NOW() - INTERVAL '7 days' - INTERVAL '14 hours', NOW() - INTERVAL '7 days', 88.0),

  -- session 9: used for duplicate charge test — two payments will reference this same session_id
  (5, 2, NOW() - INTERVAL '8 days' - INTERVAL '2 hours', NOW() - INTERVAL '8 days', 25.0),

  -- sessions for station reliability (station 2 = fault, station 4 = offline — multiple failures)
  (2, 5, NOW() - INTERVAL '10 days', NULL, NULL),
  (4, 5, NOW() - INTERVAL '12 days', NULL, NULL);

-- Payments
INSERT INTO payments (session_id, amount_eur, status, method) VALUES
  -- normal
  (1, 8.50,  'success', 'card'),
  (2, 6.00,  'success', 'rfid'),
  (3, 12.00, 'success', 'app'),

  -- payment failures (station 2 and station 4 area users)
  (4, 5.00,  'failed', 'card'),
  (5, 4.50,  'failed', 'rfid'),
  (6, 3.00,  'failed', 'app'),

  -- successful payment on short session
  (7, 0.20,  'success', 'card'),

  -- payment on long session
  (8, 35.00, 'success', 'app'),

  -- DUPLICATE CHARGES: two payments for session_id 9 (same session)
  (9, 10.00, 'success', 'card'),
  (9, 10.00, 'success', 'card'),

  -- station reliability failure payments
  (10, 0.00, 'failed', 'rfid'),
  (11, 0.00, 'failed', 'rfid');
