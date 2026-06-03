import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { queue_id, action, transcription } = await req.json();

  if (!["approve", "reject", "skip"].includes(action)) {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  const { error } = await supabase.from("review_decisions").upsert({
    queue_id,
    action,
    transcription: action === "approve" ? transcription : null,
    decided_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
