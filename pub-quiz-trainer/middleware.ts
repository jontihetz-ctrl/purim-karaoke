import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes the session token if expired — must be called on every request.
  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated users hitting protected pages get sent to /auth.
  // For /onboard we also preserve the ?join= invite code in a short-lived cookie
  // so the auth callback can restore it after sign-in.
  const { pathname, searchParams, origin } = request.nextUrl
  const PROTECTED = ['/onboard', '/quiz', '/dashboard', '/team']
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))
  const hasCookieUser = request.cookies.get('quiz_player_id')?.value

  if (!user && !hasCookieUser && isProtected) {
    const authUrl = new URL('/auth', origin)
    const redirect = NextResponse.redirect(authUrl)

    const joinCode = searchParams.get('join')
    if (joinCode) {
      redirect.cookies.set('pending_join', joinCode, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 15, // 15 min
        sameSite: 'lax',
      })
    }
    return redirect
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)'],
}
