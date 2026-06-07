import { NextRequest, NextResponse } from 'next/server'
import { getEffectiveUser } from '@/lib/supabase/server'

// Incremental save — only new_answers are inserted, never re-sent.
// session_id is returned on first call and must be passed back on all subsequent calls.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { new_answers, all_count, correct_count: bodyCorrect, session_id } = body

  if (!Array.isArray(new_answers)) {
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

  let sid = session_id

  if (!sid) {
    // First save — create the session
    const { data: session } = await db.from('quiz_sessions')
      .insert({
        player_id: userId,
        team_id: profile.team_id,
        category: null,
        difficulty: null,
        total_questions: all_count ?? new_answers.length,
        correct_count: bodyCorrect ?? 0,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (!session) return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    sid = session.id
  } else {
    // Subsequent save — just update the session totals
    await db.from('quiz_sessions')
      .update({
        total_questions: all_count,
        correct_count: bodyCorrect,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sid)
      .eq('player_id', userId)
  }

  // Only insert the NEW answers — never re-insert previously saved ones
  if (new_answers.length > 0) {
    const rows = new_answers.map((a: {
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
  }

  return NextResponse.json({ ok: true, session_id: sid })
}
