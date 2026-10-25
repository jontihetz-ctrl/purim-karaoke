import { NextResponse } from "next/server";
import { vps, BOT_DIR } from "@/lib/vps";

export async function GET() {
  try {
    const [spendRes, limitsRes] = await Promise.all([
      vps(`cat ${BOT_DIR}/data/spend.json 2>/dev/null || echo '{}'`),
      vps(`cat ${BOT_DIR}/data/limits.json 2>/dev/null || echo '{"dailyUSD":1,"monthlyUSD":10}'`),
    ]);
    const spend = JSON.parse(spendRes.stdout.trim() || "{}");
    const limits = JSON.parse(limitsRes.stdout.trim() || '{"dailyUSD":1,"monthlyUSD":10}');
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);
    return NextResponse.json({
      today: spend.daily?.[today] ?? 0,
      month: spend.monthly?.[month] ?? 0,
      lifetime: spend.lifetime ?? 0,
      limits,
      daily: spend.daily ?? {},
      monthly: spend.monthly ?? {},
    });
  } catch {
    return NextResponse.json({ today: 0, month: 0, lifetime: 0, limits: { dailyUSD: 1, monthlyUSD: 10 }, error: "VPS offline" });
  }
}

export async function POST(req: Request) {
  try {
    const { dailyUSD, monthlyUSD } = await req.json();
    if (typeof dailyUSD !== "number" || typeof monthlyUSD !== "number") {
      return NextResponse.json({ error: "Invalid limits" }, { status: 400 });
    }
    const json = JSON.stringify({ dailyUSD, monthlyUSD });
    await vps(`mkdir -p ${BOT_DIR}/data && echo '${json}' > ${BOT_DIR}/data/limits.json`);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
