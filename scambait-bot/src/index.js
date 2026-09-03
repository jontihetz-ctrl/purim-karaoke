// index.js — WhatsApp scambait bot + Guardian Net Phase 0.
// Gerald auto-initiates contact when a new number is added to targets.json.

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");

const { getConversation, appendMessage } = require("./store");
const { generateReply } = require("./claudeClient");
const { updateSignal } = require("./signals");
const { classifyMessage, getEscalation } = require("./tagging");
const { startApi } = require("./api");
const { OPENING_MESSAGE } = require("./persona");

const AUTH_DIR = path.join(__dirname, "..", "auth");
const TARGETS_FILE = path.join(__dirname, "..", "config", "targets.json");
const DATA_DIR = path.join(__dirname, "..", "data");
const STATUS_FILE = path.join(DATA_DIR, "status.json");
const QR_FILE = path.join(DATA_DIR, "qr.json");
const INITIATED_FILE = path.join(DATA_DIR, "initiated.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(path.join(__dirname, "..", "config"))) {
    fs.mkdirSync(path.join(__dirname, "..", "config"), { recursive: true });
  }
}

function writeStatus(status) {
  ensureDataDir();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

function writeQR(dataUrl) {
  ensureDataDir();
  fs.writeFileSync(QR_FILE, JSON.stringify({ dataUrl, ts: new Date().toISOString() }, null, 2));
}

function clearQR() {
  try { if (fs.existsSync(QR_FILE)) fs.unlinkSync(QR_FILE); } catch {}
}

function loadTargets() {
  if (!fs.existsSync(TARGETS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(TARGETS_FILE, "utf-8")); } catch { return []; }
}

function getInitiated() {
  if (!fs.existsSync(INITIATED_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(INITIATED_FILE, "utf-8")); } catch { return []; }
}

function markInitiated(jid) {
  const list = getInitiated();
  if (!list.includes(jid)) {
    list.push(jid);
    ensureDataDir();
    fs.writeFileSync(INITIATED_FILE, JSON.stringify(list, null, 2));
  }
}

function randomDelayMs() {
  const min = 8000;
  const max = 90000;
  return Math.floor(min + Math.random() * (max - min));
}

async function recordSignalAsync(jid, text) {
  try {
    const { tags, payments } = await classifyMessage(text);
    const escalation = getEscalation(tags);
    updateSignal(jid, { newTags: tags, newPayments: payments, escalation });
    if (tags.length) console.log(`[guardian-net] ${jid.slice(0, 12)}… tags: ${tags.join(", ")} (${escalation})`);
  } catch (e) {
    console.error("[guardian-net] signal record failed:", e.message);
  }
}

// Send Gerald's opening message to a new target (fire once per JID)
async function initiateContact(sock, jid) {
  const initiated = getInitiated();
  if (initiated.includes(jid)) return;

  // Human-like delay before sending first message: 15–45 seconds
  const delay = 15000 + Math.floor(Math.random() * 30000);
  console.log(`[${jid}] New target — sending opening message in ${Math.round(delay / 1000)}s`);
  await new Promise((r) => setTimeout(r, delay));

  try {
    await sock.sendPresenceUpdate("composing", jid);
    await new Promise((r) => setTimeout(r, 2500));
    await sock.sendMessage(jid, { text: OPENING_MESSAGE });
    appendMessage(jid, "assistant", OPENING_MESSAGE);
    markInitiated(jid);
    console.log(`[${jid}] Opening message sent.`);
  } catch (e) {
    console.error(`[${jid}] Failed to send opening message:`, e.message);
  }
}

// Watch targets.json — fire initiateContact for any new JIDs added
function watchTargets(sock) {
  let knownTargets = new Set(loadTargets());

  // Initiate with any targets that were added before the bot connected
  for (const jid of knownTargets) {
    initiateContact(sock, jid).catch(console.error);
  }

  if (!fs.existsSync(TARGETS_FILE)) return;

  fs.watch(TARGETS_FILE, () => {
    // Debounce
    setTimeout(() => {
      const current = loadTargets();
      for (const jid of current) {
        if (!knownTargets.has(jid)) {
          knownTargets.add(jid);
          initiateContact(sock, jid).catch(console.error);
        }
      }
    }, 500);
  });
}

async function startBot() {
  ensureDataDir();
  writeStatus({ connected: false, phone: null, connectedAt: null, lastMessageAt: null });

  if (process.env.SIGNAL_SALT) {
    startApi();
  } else {
    console.warn("[guardian-net] SIGNAL_SALT not set — signals disabled.");
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("Scan this QR code with the burner WhatsApp number:");
      qrcode.generate(qr, { small: true });
      try {
        const dataUrl = await QRCode.toDataURL(qr, { width: 300 });
        writeQR(dataUrl);
        console.log("QR saved to data/qr.json for web UI.");
      } catch (e) {
        console.error("QR image save error:", e.message);
      }
    }

    if (connection === "close") {
      clearQR();
      writeStatus({ connected: false, phone: null, connectedAt: null, lastMessageAt: null });
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      clearQR();
      const phone = sock.user?.id?.split(":")[0] ?? null;
      writeStatus({ connected: true, phone, connectedAt: new Date().toISOString(), lastMessageAt: null });
      console.log("Connected to WhatsApp as", phone);
      // Start watching for new targets
      watchTargets(sock);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;

        const jid = msg.key.remoteJid;
        const targets = loadTargets();
        if (!targets.includes(jid)) continue;

        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";
        if (!text) continue;

        console.log(`[${jid}] scammer: ${text}`);

        try {
          if (fs.existsSync(STATUS_FILE)) {
            const s = JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
            s.lastMessageAt = new Date().toISOString();
            writeStatus(s);
          }
        } catch {}

        if (process.env.SIGNAL_SALT) {
          recordSignalAsync(jid, text);
        }

        appendMessage(jid, "user", text);
        const convo = getConversation(jid);
        const apiMessages = convo.messages.map((m) => ({ role: m.role, content: m.content }));

        let reply;
        try {
          reply = await generateReply(apiMessages);
        } catch (err) {
          if (err.message.startsWith("Spend limit")) {
            console.warn(`[${jid}] Spend limit hit — skipping reply:`, err.message);
            continue;
          }
          throw err;
        }

        appendMessage(jid, "assistant", reply);

        const delay = randomDelayMs();
        console.log(`[${jid}] replying in ${Math.round(delay / 1000)}s: ${reply}`);

        setTimeout(async () => {
          await sock.sendPresenceUpdate("composing", jid);
          setTimeout(async () => {
            await sock.sendMessage(jid, { text: reply });
          }, 1500);
        }, delay);
      } catch (err) {
        console.error("Error handling message:", err);
      }
    }
  });
}

startBot().catch((err) => console.error("Fatal error:", err));
