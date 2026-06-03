import { NextRequest, NextResponse } from 'next/server'
import { getEffectiveUser } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId, db } = await getEffectiveUser()

  const { invite_code } = await req.json()
  if (!invite_code?.trim()) return NextResponse.json({ error: 'Invite code required' }, { status: 400 })

  const { data: team } = await db
    .from('quiz_teams')
    .select('id, name')
    .eq('invite_code', invite_code.trim().toUpperCase())
    .single()

  if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

  await db.from('quiz_players').update({ team_id: team.id }).eq('id', userId)

  return NextResponse.json({ ok: true, team })
}
