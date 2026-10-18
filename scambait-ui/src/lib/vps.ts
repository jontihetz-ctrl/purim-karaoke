const BOT_DIR = "/root/whatsapp-scambait";

export async function vps(cmd: string): Promise<{ stdout: string; stderr: string }> {
  const url = process.env.VPS_BRIDGE_URL;
  const secret = process.env.VPS_BRIDGE_SECRET;
  if (!url || !secret) throw new Error("VPS_BRIDGE_URL or VPS_BRIDGE_SECRET not set");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Secret": secret },
    body: JSON.stringify({ cmd }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Bridge HTTP ${res.status}`);
  return res.json();
}

export { BOT_DIR };
