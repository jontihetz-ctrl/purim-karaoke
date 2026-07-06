// api.js — Guardian Net Phase 0 local query API.
// Bound to 127.0.0.1 ONLY — never expose this port publicly.

const express = require("express");
const { getByHash, getStats } = require("./signals");

const app = express();
app.use(express.json());

const PORT = Number(process.env.SIGNALS_API_PORT ?? 4242);

app.get("/check", (req, res) => {
  const hash = req.query.contact_hash;
  if (!hash || typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash)) {
    return res.status(400).json({ error: "contact_hash must be a 64-char hex SHA256" });
  }
  const signal = getByHash(hash);
  if (!signal) {
    return res.json({ match: false, occurrences: 0, tags: [], escalation_level: null });
  }
  return res.json({
    match: true,
    occurrences: signal.message_count,
    tags: signal.script_tags,
    escalation_level: signal.escalation_level,
    first_seen: signal.first_seen,
    last_seen: signal.last_seen,
  });
});

app.get("/stats", (_req, res) => {
  res.json(getStats());
});

function startApi() {
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`[guardian-net] Local API on http://127.0.0.1:${PORT} — localhost only`);
    console.log(`[guardian-net]   GET /stats`);
    console.log(`[guardian-net]   GET /check?contact_hash=<sha256>`);
  });
}

module.exports = { startApi };
