-- schema.sql
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

CREATE TABLE stations (
    id          SERIAL PRIMARY KEY,
    location    TEXT NOT NULL,
    connector   TEXT NOT NULL CHECK (connector IN ('Type2', 'CCS', 'CHAdeMO')),
    status      TEXT NOT NULL CHECK (status IN ('online', 'offline', 'fault'))
);

CREATE TABLE users (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    customer_type TEXT NOT NULL CHECK (customer_type IN ('B2B', 'B2C')),
    email        TEXT NOT NULL UNIQUE
);

CREATE TABLE sessions (
    id           SERIAL PRIMARY KEY,
    station_id   INT REFERENCES stations(id),
    user_id      INT REFERENCES users(id),
    started_at   TIMESTAMPTZ NOT NULL,
    ended_at     TIMESTAMPTZ,               -- NULL = session never completed
    energy_kwh   NUMERIC(6,2)
);

CREATE TABLE payments (
    id           SERIAL PRIMARY KEY,
    session_id   INT REFERENCES sessions(id),
    amount_eur   NUMERIC(8,2) NOT NULL,
    status       TEXT NOT NULL CHECK (status IN ('success', 'failed', 'refunded')),
    method       TEXT NOT NULL CHECK (method IN ('card', 'rfid', 'app'))
);
