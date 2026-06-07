import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=invalid_code`)
  }

  // Build the redirect response first so we can set cookies directly on it.
  // The Supabase client's setAll writes to this response, so the session
  // cookies survive the redirect to the browser.
  const redirectFallback = NextResponse.redirect(`${origin}/auth?error=exchange_failed`)

  let redirectUrl = `${origin}/auth?error=exchange_failed`

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectFallback.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (!error) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('quiz_players')
        .select('id')
        .eq('id', user.id)
        .single()
      redirectUrl = profile ? `${origin}/quiz/play` : `${origin}/onboard`
    } else {
      redirectUrl = `${origin}/auth?error=no_user`
    }
  }

  // Create the final redirect with all cookies copied from the exchange step
  const response = NextResponse.redirect(redirectUrl)
  redirectFallback.cookies.getAll().forEach(c => response.cookies.set(c.name, c.value))
  return response
}
