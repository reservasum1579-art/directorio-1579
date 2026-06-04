import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  // `cookies()` returns a Promise in the App Router, so we await it
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase expects a `getAll` method returning an array of { name, value }
        getAll() {
          // RequestCookies may not have `getAll` in all environments, fallback to empty array
          return cookieStore.getAll?.() ?? [];
        },
        // `setAll` is deprecated but required for older SDKs – provide a no‑op
        setAll(_cookies) {
          // No server‑side cookie setting here
        },
      },
    }
  );
}
