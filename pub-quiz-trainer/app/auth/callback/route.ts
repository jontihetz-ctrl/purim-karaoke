import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }

  // Collect all cookies that Supabase wants to set, then apply them
  // directly to the final response — no intermediary, no header copying.
  const pendingCookies: Array<{ name: string; value: string; options: CookieOptions }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Update req.cookies so subsequent getAll() reads see the new tokens.
            req.cookies.set(name, value)
            pendingCookies.push({ name, value, options })
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message, error.code)
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.user) {
    console.error('[auth/callback] no user after exchange')
    return NextResponse.redirect(`${origin}/auth?error=no_user`)
  }

  // The await here ensures any async cookie setAll calls (from the SIGNED_IN
  // event) have had a chance to flush before we build the response.
  const { data: profile } = await supabase
    .from('quiz_players')
    .select('id')
    .eq('id', data.user.id)
    .single()

  const redirectTo = profile ? `${origin}/quiz/play` : `${origin}/onboard`
  const response = NextResponse.redirect(redirectTo)

  // Write all session cookies directly onto the response.
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  )

  // Fallback identity cookie — getEffectiveUser() uses this if Supabase
  // session cookies fail to propagate (e.g. SameSite/Secure attribute mismatch).
  response.cookies.set('quiz_player_id', data.user.id, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  console.log('[auth/callback] success uid=%s pendingCookies=%d redirectTo=%s',
    data.user.id, pendingCookies.length, redirectTo)

  return response
}
