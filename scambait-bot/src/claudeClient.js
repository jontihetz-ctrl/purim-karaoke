// aiClient.js (kept as claudeClient.js for import compatibility)
// Calls OpenAI gpt-4o-mini. Requires OPENAI_API_KEY in environment.
// Enforces spend limits and records every call's token usage.

const { SYSTEM_PROMPT } = require("./persona");
const { recordUsage, checkLimits } = require("./spend");

const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

async function generateReply(conversationMessages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY environment variable is not set.");

  const check = checkLimits();
  if (!check.allowed) throw new Error(`Spend limit: ${check.reason}`);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationMessages,
  ];

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 300, messages }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();

  if (data.usage) {
    const cost = recordUsage(data.usage.prompt_tokens, data.usage.completion_tokens);
    console.log(`[spend] $${cost.toFixed(5)} (${data.usage.prompt_tokens}in/${data.usage.completion_tokens}out)`);
  }

  return data.choices?.[0]?.message?.content?.trim() ?? "...";
}

module.exports = { generateReply };
