import { NextResponse } from "next/server";
import { vps, BOT_DIR } from "@/lib/vps";

export async function GET(_req: Request, { params }: { params: { jid: string } }) {
  try {
    const jid = decodeURIComponent(params.jid);
    const { stdout } = await vps(`cat ${BOT_DIR}/data/conversations.json 2>/dev/null || echo '{}'`);
    const all = JSON.parse(stdout.trim() || "{}");
    const convo = all[jid] ?? null;
    return NextResponse.json(convo);
  } catch {
    return NextResponse.json(null);
  }
}
