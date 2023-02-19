import { navigationStore } from "$lib/stores/navigation.store";
import { supabase } from "$lib/supabase/supabase-client";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  navigationStore.currentPage("dealOverview");
  // const response = await fetch("/api/deals?dealer=" + params.dealerId);
  const { data } = await supabase.from("deals").select().eq("dealer_id", params.dealerId);

  // if (response.ok) {
  //   const deals = await response.json();
  //   return {
  //     deals
  //   };
  // }

  if (data) {
    return {
      deals: data
    };
  }
}
