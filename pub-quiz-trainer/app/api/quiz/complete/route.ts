import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { answers, category, difficulty } = await req.json()

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: 'No answers' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('quiz_players')
    .select('id, team_id')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'No profile' }, { status: 400 })

  const correct_count = answers.filter((a: { is_correct: boolean }) => a.is_correct).length

  const { data: session, error: sessionErr } = await supabase
    .from('quiz_sessions')
    .insert({
      player_id: user.id,
      team_id: profile.team_id,
      category: category || null,
      difficulty: difficulty || null,
      total_questions: answers.length,
      correct_count,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (sessionErr || !session) {
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 })
  }

  const rows = answers.map((a: {
    question_text: string
    category: string
    difficulty: string
    correct_answer: string
    player_answer: string
    is_correct: boolean
    time_taken_ms: number
  }) => ({
    session_id: session.id,
    player_id: user.id,
    question_text: a.question_text,
    category: a.category,
    difficulty: a.difficulty,
    correct_answer: a.correct_answer,
    player_answer: a.player_answer,
    is_correct: a.is_correct,
    time_taken_ms: a.time_taken_ms,
  }))

  await supabase.from('quiz_answers').insert(rows)

  return NextResponse.json({ ok: true, session_id: session.id, correct_count, total: answers.length })
}
