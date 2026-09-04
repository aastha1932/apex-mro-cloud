import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// This app has no authentication (open access by design). We connect
// directly with the anon key on the server for data fetching and mutations.
// Row Level Security policies on every table allow anon/authenticated
// access, so this is safe for this demo-scoped app.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    },
  )
}
