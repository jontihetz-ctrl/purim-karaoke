// spend.js — tracks OpenAI API spend and enforces daily/monthly limits.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const SPEND_FILE = path.join(DATA_DIR, "spend.json");
const LIMITS_FILE = path.join(DATA_DIR, "limits.json");

// gpt-4o-mini pricing
const PRICING = {
  inputPerToken: 0.15 / 1_000_000,
  outputPerToken: 0.60 / 1_000_000,
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getLimits() {
  ensureDataDir();
  if (fs.existsSync(LIMITS_FILE)) {
    try { return JSON.parse(fs.readFileSync(LIMITS_FILE, "utf-8")); } catch {}
  }
  return { dailyUSD: 1.00, monthlyUSD: 10.00 };
}

function saveLimits(limits) {
  ensureDataDir();
  fs.writeFileSync(LIMITS_FILE, JSON.stringify(limits, null, 2));
}

function load() {
  ensureDataDir();
  if (!fs.existsSync(SPEND_FILE)) {
    fs.writeFileSync(SPEND_FILE, JSON.stringify({ lifetime: 0, daily: {}, monthly: {} }, null, 2));
  }
  try { return JSON.parse(fs.readFileSync(SPEND_FILE, "utf-8")); }
  catch { return { lifetime: 0, daily: {}, monthly: {} }; }
}

function save(data) {
  ensureDataDir();
  fs.writeFileSync(SPEND_FILE, JSON.stringify(data, null, 2));
}

function recordUsage(inputTokens, outputTokens) {
  const cost = inputTokens * PRICING.inputPerToken + outputTokens * PRICING.outputPerToken;
  const data = load();
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  data.lifetime = (data.lifetime || 0) + cost;
  data.daily[today] = (data.daily[today] || 0) + cost;
  data.monthly[month] = (data.monthly[month] || 0) + cost;

  // Prune daily entries older than 30 days
  const days = Object.keys(data.daily).sort();
  if (days.length > 30) days.slice(0, days.length - 30).forEach(d => delete data.daily[d]);

  save(data);
  return cost;
}

function checkLimits() {
  const limits = getLimits();
  const data = load();
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const todaySpend = data.daily[today] || 0;
  const monthSpend = data.monthly[month] || 0;

  if (todaySpend >= limits.dailyUSD) {
    return { allowed: false, reason: `Daily limit $${limits.dailyUSD.toFixed(2)} reached ($${todaySpend.toFixed(4)} spent today)` };
  }
  if (monthSpend >= limits.monthlyUSD) {
    return { allowed: false, reason: `Monthly limit $${limits.monthlyUSD.toFixed(2)} reached ($${monthSpend.toFixed(4)} spent this month)` };
  }
  return { allowed: true };
}

function getSpendSummary() {
  const data = load();
  const limits = getLimits();
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  return {
    today: data.daily[today] || 0,
    month: data.monthly[month] || 0,
    lifetime: data.lifetime || 0,
    limits,
    daily: data.daily,
    monthly: data.monthly,
  };
}

module.exports = { recordUsage, checkLimits, getSpendSummary, getLimits, saveLimits, PRICING };
