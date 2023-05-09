import { navigationStore } from "$lib/stores/navigation.store";
import { getDealsByDealerId } from "$lib/supabase/deal-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, parent }: LoadEvent) {
  navigationStore.currentPage("dealOverview");
  const { supabase } = await parent();

  if (!params.dealerId) history.back();

  const deals = await getDealsByDealerId(supabase, params.dealerId!, false);
  return {
    deals
  };
}
