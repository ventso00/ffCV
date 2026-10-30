-- SQLite / Cloudflare D1 target schema. Supplied, not deployed in this pilot.
PRAGMA foreign_keys=ON;
CREATE TABLE pilot_admissions (
 uid TEXT PRIMARY KEY CHECK(length(uid) BETWEEN 5 AND 15),
 country TEXT NOT NULL CHECK(country='MG'), region TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','approved','revoked')),
 verified_at TEXT, evidence_reference TEXT, verified_by TEXT
);
CREATE TABLE profile_snapshots (
 id TEXT PRIMARY KEY, uid TEXT NOT NULL REFERENCES pilot_admissions(uid),
 provider TEXT NOT NULL, fetched_at TEXT NOT NULL,
 payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), sha256 TEXT NOT NULL,
 UNIQUE(uid,provider,fetched_at)
);
CREATE TRIGGER snapshot_no_update BEFORE UPDATE ON profile_snapshots
 BEGIN SELECT RAISE(ABORT,'Create a new snapshot; existing snapshots are immutable'); END;
CREATE TABLE lookup_history (
 id TEXT PRIMARY KEY, uid TEXT NOT NULL, requested_at TEXT NOT NULL,
 provider TEXT, outcome TEXT NOT NULL, snapshot_id TEXT REFERENCES profile_snapshots(id),
 duration_ms INTEGER, requester_hash TEXT
);
CREATE INDEX lookup_by_uid_date ON lookup_history(uid,requested_at);
CREATE TABLE cv_designs (
 id TEXT PRIMARY KEY, snapshot_id TEXT NOT NULL REFERENCES profile_snapshots(id),
 theme TEXT NOT NULL CHECK(theme IN ('solar','neon','ice')),
 format TEXT NOT NULL CHECK(format IN ('post','story','square')),
 created_at TEXT NOT NULL
);
CREATE TABLE topup_simulations (
 id TEXT PRIMARY KEY, snapshot_id TEXT NOT NULL REFERENCES profile_snapshots(id),
 diamonds INTEGER NOT NULL CHECK(diamonds>0 AND diamonds<=100000),
 created_at TEXT NOT NULL, simulation INTEGER NOT NULL DEFAULT 1 CHECK(simulation=1)
);
CREATE TABLE rate_limit_buckets (
 scope_hash TEXT NOT NULL, window_start INTEGER NOT NULL, hits INTEGER NOT NULL,
 PRIMARY KEY(scope_hash,window_start)
);
-- Only backend service identities write admissions/snapshots. No public UPDATE route.
-- Administrative deletion may be used for retention/privacy; it is not profile editing.
