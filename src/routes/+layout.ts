import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, data, depends }: LoadEvent) {
  depends("supabase:auth");

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_API_KEY,
    event: { fetch },
    serverSession: data?.session
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return { supabase, session };
}
