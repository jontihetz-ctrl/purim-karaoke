import { NextRequest, NextResponse } from 'next/server'
import { PRESET_PLAYERS } from '@/lib/players'

export async function POST(req: NextRequest) {
  const { player_id } = await req.json()
  const valid = PRESET_PLAYERS.find(p => p.id === player_id)
  if (!valid) return NextResponse.json({ error: 'Invalid player' }, { status: 400 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('quiz_player_id', player_id, {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
  return res
}
