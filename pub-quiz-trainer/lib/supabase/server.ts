import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const DEMO_PLAYER_ID = '00000000-0000-0000-0000-000000000001'

export async function getEffectiveUser() {
  const regular = createClient()

  // getUser() validates the token with Supabase's server (most reliable).
  const { data: { user } } = await regular.auth.getUser()
  if (user) return { userId: user.id, db: regular }

  // Fallback: getSession() reads the JWT from the cookie without a network call.
  // Works when the token is still valid but getUser() had a transient issue.
  const { data: { session } } = await regular.auth.getSession()
  if (session?.user) return { userId: session.user.id, db: regular }

  const cookieStore = cookies()
  const playerCookie = cookieStore.get('quiz_player_id')
  if (playerCookie?.value) {
    return { userId: playerCookie.value, db: createServiceClient() }
  }

  throw new Error('Not authenticated')
}

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: (_cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) => {},
      },
    }
  )
}
