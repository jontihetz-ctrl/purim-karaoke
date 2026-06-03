import { NextRequest, NextResponse } from 'next/server'
import { getEffectiveUser } from '@/lib/supabase/server'

function randomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  const { userId, db } = await getEffectiveUser()

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Team name required' }, { status: 400 })

  let team = null
  for (let i = 0; i < 5; i++) {
    const { data, error } = await db
      .from('quiz_teams')
      .insert({ name: name.trim(), invite_code: randomCode(), owner_id: userId })
      .select()
      .single()
    if (!error) { team = data; break }
  }

  if (!team) return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })

  await db.from('quiz_players').update({ team_id: team.id }).eq('id', userId)

  return NextResponse.json({ ok: true, team })
}
