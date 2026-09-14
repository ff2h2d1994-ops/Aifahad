import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase client — reads/writes the auth cookie for the
// current request. Used inside Server Components, Server Actions and
// Route Handlers. Never expose the service role key to the client.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // called from a Server Component — safe to ignore, middleware refreshes the session
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // ignore, see above
          }
        },
      },
    }
  );
}

// Admin-only client using the service role key. ONLY ever import this
// inside Server Actions / Route Handlers that have already verified the
// caller is the authenticated admin. Never import in a Client Component.
export function createAdminClient() {
  const { createClient: createRawClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
