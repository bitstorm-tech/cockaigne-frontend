import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Session, Supabase } from "$lib/supabase/supabase-client";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LoadEvent } from "@sveltejs/kit";

type ReturnType = { supabase: Supabase; session: Session | null };

export async function load({ fetch, data, depends }: LoadEvent): Promise<ReturnType> {
  depends("supabase:auth");

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_API_KEY,
    event: { fetch },
    serverSession: data?.session
  });

  const result = await supabase.auth.getSession();
  const session: Session | null = result.data.session;

  return { supabase, session };
}
