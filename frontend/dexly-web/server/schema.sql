CREATE TABLE IF NOT EXISTS client (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
username TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
mc_subdomain TEXT NOT NULL,
mc_client_id TEXT NOT NULL,
mc_client_secret TEXT NOT NULL,
created_at TEXT NOT NULL DEFAULT (datetime('now')),
updated_at TEXT
);