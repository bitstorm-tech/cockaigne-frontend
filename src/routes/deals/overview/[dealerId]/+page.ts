import { navigationStore } from "$lib/stores/navigation.store";
import { supabase } from "$lib/supabase/supabase-client";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  navigationStore.currentPage("dealOverview");
  const { data } = await supabase.from("deals").select().eq("dealer_id", params.dealerId).eq("template", false);

  if (data) {
    return {
      deals: data
    };
  }
}
