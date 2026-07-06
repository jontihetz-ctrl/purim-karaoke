// index.js
// WhatsApp scambait bot: only engages with numbers YOU explicitly add to the
// target list (config/targets.json). It will never auto-reply to random contacts.

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

const { getConversation, appendMessage } = require("./store");
const { generateReply } = require("./claudeClient");

const AUTH_DIR = path.join(__dirname, "..", "auth");
const TARGETS_FILE = path.join(__dirname, "..", "config", "targets.json");

function loadTargets() {
  if (!fs.existsSync(TARGETS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TARGETS_FILE, "utf-8"));
}

function randomDelayMs() {
  // human-ish reply delay: 8s to 90s, weighted toward shorter
  const min = 8000;
  const max = 90000;
  return Math.floor(min + Math.random() * (max - min));
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("Scan this QR code with the burner WhatsApp number:");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("Connected to WhatsApp.");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;

        const jid = msg.key.remoteJid;
        const targets = loadTargets();

        // Safety gate: only engage numbers you've explicitly added.
        if (!targets.includes(jid)) continue;

        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";
        if (!text) continue;

        console.log(`[${jid}] scammer: ${text}`);

        appendMessage(jid, "user", text);
        const convo = getConversation(jid);

        const apiMessages = convo.messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const reply = await generateReply(apiMessages);
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

startBot().catch((err) => console.error("Fatal error starting bot:", err));
