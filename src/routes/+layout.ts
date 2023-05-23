import { browser } from "$app/environment";
import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { dealStore } from "$lib/stores/deal.store";
import { hotDealStore } from "$lib/stores/hot-deal.store";
import { likeStore } from "$lib/stores/like.store";
import { locationStore } from "$lib/stores/location.store";
import { searchRadiusStore } from "$lib/stores/search-radius.store";
import type { Supabase } from "$lib/supabase/supabase-client";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LoadEvent } from "@sveltejs/kit";

type ReturnType = { supabase: Supabase; userId: string | undefined; isDealer: boolean };

export async function load({ fetch, data, depends }: LoadEvent): Promise<ReturnType> {
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

  if (browser) {
    hotDealStore.load(supabase, session?.user.id);
    dealStore.load(supabase, session?.user.id);
    likeStore.load(supabase);
    locationStore.load(supabase, session?.user.id);
    searchRadiusStore.load(supabase, session?.user.id);
  }

  return {
    supabase,
    session,
    userId: session?.user.id,
    isDealer: session?.user.user_metadata.isDealer || false
  };
}
