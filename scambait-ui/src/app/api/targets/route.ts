import { NextResponse } from "next/server";
import { vps, BOT_DIR } from "@/lib/vps";

export async function GET() {
  try {
    const { stdout } = await vps(`cat ${BOT_DIR}/config/targets.json 2>/dev/null || echo '[]'`);
    return NextResponse.json(JSON.parse(stdout.trim() || "[]"));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { number } = await req.json();
    if (!number || typeof number !== "string") {
      return NextResponse.json({ error: "Missing number" }, { status: 400 });
    }
    // Normalize: strip leading + and spaces, append JID suffix
    const digits = number.replace(/[^0-9]/g, "");
    const jid = `${digits}@s.whatsapp.net`;

    const { stdout } = await vps(`cat ${BOT_DIR}/config/targets.json 2>/dev/null || echo '[]'`);
    const current: string[] = JSON.parse(stdout.trim() || "[]");

    if (!current.includes(jid)) {
      current.push(jid);
      const escaped = JSON.stringify(current).replace(/'/g, "'\\''");
      await vps(`echo '${escaped}' > ${BOT_DIR}/config/targets.json`);
    }

    return NextResponse.json({ ok: true, targets: current });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { jid } = await req.json();
    const { stdout } = await vps(`cat ${BOT_DIR}/config/targets.json 2>/dev/null || echo '[]'`);
    const current: string[] = JSON.parse(stdout.trim() || "[]");
    const updated = current.filter((t) => t !== jid);
    const escaped = JSON.stringify(updated).replace(/'/g, "'\\''");
    await vps(`echo '${escaped}' > ${BOT_DIR}/config/targets.json`);
    return NextResponse.json({ ok: true, targets: updated });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
