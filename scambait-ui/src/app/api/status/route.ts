import { NextResponse } from "next/server";
import { vps, BOT_DIR } from "@/lib/vps";

export async function GET() {
  try {
    const { stdout } = await vps(`cat ${BOT_DIR}/data/status.json 2>/dev/null || echo 'null'`);
    const status = JSON.parse(stdout.trim() || "null");
    return NextResponse.json(status ?? { connected: false });
  } catch {
    return NextResponse.json({ connected: false, error: "VPS offline" });
  }
}
