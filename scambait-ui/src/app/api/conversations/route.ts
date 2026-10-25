import { NextResponse } from "next/server";
import { vps, BOT_DIR } from "@/lib/vps";

export async function GET() {
  try {
    const { stdout } = await vps(`cat ${BOT_DIR}/data/conversations.json 2>/dev/null || echo '{}'`);
    const all: Record<string, { jid: string; startedAt: string; messages: Array<{ role: string; content: string; ts: string }> }> =
      JSON.parse(stdout.trim() || "{}");

    const list = Object.values(all).map((convo) => ({
      jid: convo.jid,
      phone: convo.jid.replace("@s.whatsapp.net", ""),
      startedAt: convo.startedAt,
      messageCount: convo.messages?.length ?? 0,
      lastMessage: convo.messages?.at(-1) ?? null,
    })).sort((a, b) => {
      const at = a.lastMessage?.ts ?? a.startedAt ?? "";
      const bt = b.lastMessage?.ts ?? b.startedAt ?? "";
      return bt.localeCompare(at);
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
