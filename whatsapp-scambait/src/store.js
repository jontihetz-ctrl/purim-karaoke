// store.js
// Minimal JSON-file persistence, keyed by WhatsApp JID (the scammer's number).
// Avoids extra DB dependencies — fine for a single-instance bot.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "conversations.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}");
}

function loadAll() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveAll(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getConversation(jid) {
  const all = loadAll();
  if (!all[jid]) {
    all[jid] = {
      jid,
      startedAt: new Date().toISOString(),
      messages: [], // { role: "user"|"assistant", content: string, ts }
      obstaclesUsed: [], // track which stalling excuses were used, avoid repeats
    };
    saveAll(all);
  }
  return all[jid];
}

function appendMessage(jid, role, content) {
  const all = loadAll();
  const convo = all[jid] || getConversation(jid);
  convo.messages.push({ role, content, ts: new Date().toISOString() });
  // keep last 40 turns so the API payload doesn't grow unbounded
  if (convo.messages.length > 40) {
    convo.messages = convo.messages.slice(-40);
  }
  all[jid] = convo;
  saveAll(all);
  return convo;
}

module.exports = { getConversation, appendMessage, loadAll, saveAll };
