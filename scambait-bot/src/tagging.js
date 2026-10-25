// tagging.js — Guardian Net Phase 0
// Classifies scammer messages into script tags + extracts payment intelligence.
// Uses regex first (free), OpenAI gpt-4o-mini fallback (cheap side-call).

const SCRIPT_TAGS = [
  "romance_opening",
  "frozen_inheritance",
  "stranded_serviceman",
  "urgent_medical",
  "customs_fee",
  "investment_opportunity",
  "gift_card_request",
  "crypto_request",
  "bank_transfer_request",
  "sob_story_general",
  "identity_verification_request",
  "photo_request",
];

// Regex → quick payment detection without an API call
const PAYMENT_REGEX = [
  { re: /\b(bitcoin|btc|ethereum|eth|usdt|tron|trc20|erc20|crypto(?:currency)?)\b/i, type: "crypto" },
  { re: /\bgift\s*card\b/i, type: "gift_card" },
  { re: /\b(itunes?|amazon|google\s*play|steam|ebay)\s*(gift\s*card|card|voucher)\b/i, type: "gift_card" },
  { re: /\b(western\s*union|moneygram|wire\s*transfer|bank\s*transfer|eft|swift)\b/i, type: "bank_transfer" },
  // Wallet addresses
  { re: /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/, type: "crypto" },
  { re: /\b0x[a-fA-F0-9]{40}\b/, type: "crypto" },
  // IBAN-like
  { re: /\b[A-Z]{2}\d{2}[A-Z0-9]{4,30}\b/, type: "bank_transfer" },
];

function regexExtract(text) {
  const payments = [];
  const seen = new Set();
  for (const { re, type } of PAYMENT_REGEX) {
    const m = text.match(re);
    if (m) {
      const key = `${type}:${m[0]}`;
      if (!seen.has(key)) {
        seen.add(key);
        payments.push({ type, destination: m[0] });
      }
    }
  }
  return payments;
}

async function classifyMessage(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  const regexPayments = regexExtract(text);

  if (!apiKey) return { tags: [], payments: regexPayments };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: `You analyze WhatsApp messages from romance/financial scammers.
Return ONLY valid JSON with:
- "tags": array of matching tags from: ${JSON.stringify(SCRIPT_TAGS)} (empty array if none match)
- "payments": array of {type, destination} for any payment requests detected
  type must be: "bank_transfer" | "gift_card" | "crypto"
  destination: the account/wallet/card if given, else null`,
          },
          { role: "user", content: `Message: "${text.slice(0, 600)}"` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    const tags = Array.isArray(parsed.tags)
      ? parsed.tags.filter((t) => SCRIPT_TAGS.includes(t))
      : [];

    // Merge and dedup regex + AI payments
    const aiPayments = Array.isArray(parsed.payments) ? parsed.payments : [];
    const allPayments = [...regexPayments, ...aiPayments];
    const seenKeys = new Set();
    const payments = allPayments.filter((p) => {
      const k = `${p.type}:${p.destination}`;
      if (seenKeys.has(k)) return false;
      seenKeys.add(k);
      return true;
    });

    return { tags, payments };
  } catch (e) {
    console.error("[tagging] classify error:", e.message);
    return { tags: [], payments: regexPayments };
  }
}

function getEscalation(tags) {
  const high = ["gift_card_request", "crypto_request", "bank_transfer_request", "customs_fee"];
  const medium = ["frozen_inheritance", "urgent_medical", "investment_opportunity", "identity_verification_request", "stranded_serviceman"];
  if (tags.some((t) => high.includes(t))) return "high";
  if (tags.some((t) => medium.includes(t))) return "medium";
  return "low";
}

module.exports = { classifyMessage, getEscalation, SCRIPT_TAGS };
