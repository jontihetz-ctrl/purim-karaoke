import { NextResponse } from 'next/server'
import { getEffectiveUser } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { userId, db } = await getEffectiveUser()
    const { data: profile } = await db
      .from('quiz_players')
      .select('id, display_name, team_id')
      .eq('id', userId)
      .single()
    return NextResponse.json({ has_profile: !!profile, profile: profile ?? null })
  } catch {
    return NextResponse.json({ has_profile: false, profile: null })
  }
}
