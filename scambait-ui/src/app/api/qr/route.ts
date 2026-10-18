import { NextResponse } from "next/server";
import { vps, BOT_DIR } from "@/lib/vps";

export async function GET() {
  try {
    const { stdout } = await vps(`cat ${BOT_DIR}/data/qr.json 2>/dev/null || echo 'null'`);
    const qr = JSON.parse(stdout.trim() || "null");
    return NextResponse.json(qr ?? { dataUrl: null });
  } catch {
    return NextResponse.json({ dataUrl: null, error: "VPS offline" });
  }
}
