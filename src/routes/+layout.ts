import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Supabase } from "$lib/supabase/supabase-client";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LoadEvent } from "@sveltejs/kit";

type ReturnType = { supabase: Supabase; userId: string | undefined; isDealer: boolean };

export async function load({ fetch, data, depends }: LoadEvent): Promise<ReturnType> {
  depends("supabase:auth");

  console.log("+layout.ts #1");

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_API_KEY,
    event: { fetch },
    serverSession: data?.session
  });

  console.log("+layout.ts #2");

  const {
    data: { session }
  } = await supabase.auth.getSession();

  console.log("+layout.ts #3");

  return {
    supabase,
    session,
    userId: session?.user.id,
    isDealer: session?.user.user_metadata.isDealer || false
  };
}
