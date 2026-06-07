import { NextRequest, NextResponse } from 'next/server'
import { getEffectiveUser } from '@/lib/supabase/server'

// Upsert session + answers — called after every answer and on navigate away.
// Accepts an optional session_id to update an existing session.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { answers, session_id } = body

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ ok: true, session_id: session_id ?? null })
  }

  let userId: string, db: Awaited<ReturnType<typeof getEffectiveUser>>['db']
  try { ({ userId, db } = await getEffectiveUser()) }
  catch { return NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) }

  let { data: profile } = await db
    .from('quiz_players')
    .select('id, team_id')
    .eq('id', userId)
    .single()

  if (!profile) {
    await db.from('quiz_players').upsert({ id: userId, display_name: 'Player' })
    profile = { id: userId, team_id: null }
  }

  const correct_count = answers.filter((a: { is_correct: boolean }) => a.is_correct).length
  const sessionData = {
    player_id: userId,
    team_id: profile.team_id,
    category: null,
    difficulty: null,
    total_questions: answers.length,
    correct_count,
    completed_at: new Date().toISOString(),
  }

  let sid = session_id

  if (sid) {
    await db.from('quiz_sessions')
      .update({ total_questions: answers.length, correct_count, completed_at: new Date().toISOString() })
      .eq('id', sid)
      .eq('player_id', userId)
    await db.from('quiz_answers').delete().eq('session_id', sid)
  } else {
    const { data: session } = await db.from('quiz_sessions')
      .insert(sessionData)
      .select()
      .single()
    if (!session) return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    sid = session.id
  }

  const rows = answers.map((a: {
    question_text: string; category: string; difficulty: string
    correct_answer: string; player_answer: string; is_correct: boolean; time_taken_ms: number
  }) => ({
    session_id: sid,
    player_id: userId,
    question_text: a.question_text,
    category: a.category,
    difficulty: a.difficulty,
    correct_answer: a.correct_answer,
    player_answer: a.player_answer,
    is_correct: a.is_correct,
    time_taken_ms: a.time_taken_ms,
  }))

  await db.from('quiz_answers').insert(rows)

  return NextResponse.json({ ok: true, session_id: sid })
}
