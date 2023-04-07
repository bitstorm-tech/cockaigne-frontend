import { navigationStore } from "$lib/stores/navigation.store";
import dealService from "$lib/supabase/deal-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  navigationStore.currentPage("dealOverview");
  // const { data } = await supabase.from("deals").select().eq("dealer_id", params.dealerId).eq("template", false);
  if (!params.dealerId) return;

  const deals = await dealService.getDealsByDealerId(params.dealerId, false);
  return {
    deals
  };
}
