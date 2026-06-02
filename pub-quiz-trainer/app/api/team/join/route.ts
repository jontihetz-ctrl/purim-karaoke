import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { invite_code } = await req.json()
  if (!invite_code?.trim()) return NextResponse.json({ error: 'Invite code required' }, { status: 400 })

  const { data: team } = await supabase
    .from('teams')
    .select('id, name')
    .eq('invite_code', invite_code.trim().toUpperCase())
    .single()

  if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

  await supabase.from('profiles').update({ team_id: team.id }).eq('id', user.id)

  return NextResponse.json({ ok: true, team })
}
