import { NextResponse } from "next/server";
import { vps } from "@/lib/vps";

const API_PORT = process.env.SIGNALS_API_PORT ?? "4242";

export async function GET() {
  try {
    // Hit the Guardian Net local API via bridge — it runs on 127.0.0.1 on the VPS
    const { stdout } = await vps(`curl -sf http://127.0.0.1:${API_PORT}/stats 2>/dev/null || echo 'null'`);
    const stats = JSON.parse(stdout.trim() || "null");
    if (!stats) {
      return NextResponse.json({ error: "Guardian Net API not running or SIGNAL_SALT not set", total_signals: 0, unique_scammers: 0, top_tags: [], by_escalation: {} });
    }
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "VPS offline", total_signals: 0, unique_scammers: 0, top_tags: [], by_escalation: {} });
  }
}
