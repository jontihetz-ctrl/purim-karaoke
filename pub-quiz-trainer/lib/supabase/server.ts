import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const DEMO_PLAYER_ID = '00000000-0000-0000-0000-000000000001'

export async function getEffectiveUser() {
  const regular = createClient()
  const { data: { user } } = await regular.auth.getUser()
  if (user) return { userId: user.id, db: regular }
  return { userId: DEMO_PLAYER_ID, db: createServiceClient() }
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
