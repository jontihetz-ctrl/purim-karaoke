import { NextRequest, NextResponse } from 'next/server'
import { getEffectiveUser } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let userId: string, db: Awaited<ReturnType<typeof getEffectiveUser>>['db']
  try { ({ userId, db } = await getEffectiveUser()) }
  catch { return NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) }

  const { display_name } = await req.json()
  if (!display_name?.trim()) return NextResponse.json({ error: 'Display name required' }, { status: 400 })

  const { error } = await db
    .from('quiz_players')
    .upsert({ id: userId, display_name: display_name.trim() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
