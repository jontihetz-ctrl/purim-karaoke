// signals.js — Guardian Net Phase 0
// Anonymized scam-intelligence store. contact_hash = sha256(jid + SALT).
// Raw JIDs are NEVER stored here. Safe in principle to publish.

const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "..", "data");

let _db = null;

function getDb() {
  if (_db) return _db;
  // Require here so the rest of the bot works even if better-sqlite3 isn't installed yet
  const Database = require("better-sqlite3");
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  _db = new Database(path.join(DATA_DIR, "signals.db"));
  _db.exec(`
    CREATE TABLE IF NOT EXISTS signals (
      id                TEXT PRIMARY KEY,
      contact_hash      TEXT NOT NULL UNIQUE,
      photo_hashes      TEXT DEFAULT '[]',
      script_tags       TEXT DEFAULT '[]',
      payment_requests  TEXT DEFAULT '[]',
      platform          TEXT DEFAULT 'whatsapp',
      first_seen        TEXT NOT NULL,
      last_seen         TEXT NOT NULL,
      message_count     INTEGER DEFAULT 0,
      escalation_level  TEXT DEFAULT 'low'
    )
  `);
  return _db;
}

function hashContact(jid) {
  const salt = process.env.SIGNAL_SALT;
  if (!salt) throw new Error("SIGNAL_SALT env var is not set — required for anonymization");
  return crypto.createHash("sha256").update(jid + salt).digest("hex");
}

const ESCALATION_RANK = { low: 0, medium: 1, high: 2 };

function updateSignal(jid, { newTags = [], newPayments = [], escalation = "low" } = {}) {
  const db = getDb();
  const hash = hashContact(jid);
  const now = new Date().toISOString();

  const existing = db.prepare("SELECT * FROM signals WHERE contact_hash = ?").get(hash);

  if (!existing) {
    db.prepare(`
      INSERT INTO signals
        (id, contact_hash, photo_hashes, script_tags, payment_requests, platform, first_seen, last_seen, message_count, escalation_level)
      VALUES (?, ?, '[]', '[]', '[]', 'whatsapp', ?, ?, 0, 'low')
    `).run(crypto.randomUUID(), hash, now, now);
  }

  const row = db.prepare("SELECT * FROM signals WHERE contact_hash = ?").get(hash);

  const scriptTags = JSON.parse(row.script_tags || "[]");
  const paymentRequests = JSON.parse(row.payment_requests || "[]");

  for (const tag of newTags) {
    if (!scriptTags.includes(tag)) scriptTags.push(tag);
  }
  paymentRequests.push(...newPayments);

  const currentRank = ESCALATION_RANK[row.escalation_level] ?? 0;
  const newRank = ESCALATION_RANK[escalation] ?? 0;
  const finalEscalation = newRank > currentRank ? escalation : row.escalation_level;

  db.prepare(`
    UPDATE signals SET
      script_tags       = ?,
      payment_requests  = ?,
      last_seen         = ?,
      message_count     = message_count + 1,
      escalation_level  = ?
    WHERE contact_hash = ?
  `).run(
    JSON.stringify(scriptTags),
    JSON.stringify(paymentRequests),
    now,
    finalEscalation,
    hash,
  );

  return hash;
}

function getByHash(hash) {
  try {
    const db = getDb();
    const row = db.prepare("SELECT * FROM signals WHERE contact_hash = ?").get(hash);
    if (!row) return null;
    return {
      ...row,
      script_tags: JSON.parse(row.script_tags || "[]"),
      payment_requests: JSON.parse(row.payment_requests || "[]"),
      photo_hashes: JSON.parse(row.photo_hashes || "[]"),
    };
  } catch { return null; }
}

function getStats() {
  try {
    const db = getDb();
    const total = db.prepare("SELECT COUNT(*) as n FROM signals").get().n;
    const unique = db.prepare("SELECT COUNT(DISTINCT contact_hash) as n FROM signals").get().n;
    const byEscalation = db.prepare(`
      SELECT escalation_level, COUNT(*) as n FROM signals GROUP BY escalation_level
    `).all();

    const rows = db.prepare("SELECT script_tags FROM signals").all();
    const tagCounts = {};
    for (const row of rows) {
      for (const tag of JSON.parse(row.script_tags || "[]")) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    return {
      total_signals: total,
      unique_scammers: unique,
      by_escalation: Object.fromEntries(byEscalation.map(r => [r.escalation_level, r.n])),
      top_tags: topTags,
    };
  } catch (e) {
    return { total_signals: 0, unique_scammers: 0, by_escalation: {}, top_tags: [], error: e.message };
  }
}

module.exports = { updateSignal, hashContact, getByHash, getStats };
