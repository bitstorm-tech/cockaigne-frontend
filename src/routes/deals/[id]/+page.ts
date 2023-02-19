import { newDeal } from "$lib/database/deal/deal.model";
import AccountService from "$lib/supabase/account-service";
import DealService from "$lib/supabase/deal-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, url }: LoadEvent) {
  const id = params.id;

  if (!id) {
    return;
  }

  if (id.toLowerCase() === "new") {
    const deal = newDeal();
    const dealerId = url.searchParams.get("dealerId");
    if (dealerId) {
      deal.category_id = await AccountService.getDefaultCategory();
      deal.dealer_id = dealerId;
    }
    return { deal };
  }

  const deal = await DealService.getDeal(id);

  return {
    deal
  };
}
