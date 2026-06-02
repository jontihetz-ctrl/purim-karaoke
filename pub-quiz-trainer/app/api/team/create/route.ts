import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function randomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Team name required' }, { status: 400 })

  let team = null
  for (let i = 0; i < 5; i++) {
    const { data, error } = await supabase
      .from('teams')
      .insert({ name: name.trim(), invite_code: randomCode(), owner_id: user.id })
      .select()
      .single()
    if (!error) { team = data; break }
  }

  if (!team) return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })

  await supabase.from('profiles').update({ team_id: team.id }).eq('id', user.id)

  return NextResponse.json({ ok: true, team })
}
