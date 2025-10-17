import Database from 'better-sqlite3';

export const db = new Database('dexly.db');

export function runMigrations() {
const ddl = `
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
    CREATE TRIGGER IF NOT EXISTS trg_client_updated
    AFTER UPDATE ON client
    BEGIN
    UPDATE client SET updated_at = datetime('now') WHERE id = NEW.id;
    END;`;
    db.exec(ddl);
}