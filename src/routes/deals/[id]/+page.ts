import { newDeal } from "$lib/database/deal/deal.model";
import DateTimeUtils from "$lib/date-time.utils";
import accountService from "$lib/supabase/account-service";
import dealService from "$lib/supabase/deal-service";
import storageService from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, url }: LoadEvent) {
  const id = params.id;

  if (!id) {
    return;
  }

  const defaultCategory = await accountService.getDefaultCategory();

  if (id.toLowerCase() === "new") {
    const deal = newDeal();
    const dealerId = url.searchParams.get("dealerId");
    if (dealerId) {
      deal.category_id = defaultCategory;
      deal.dealer_id = dealerId;
    }
    return { deal };
  }

  const deal = await dealService.getDeal(id);
  if (deal) {
    DateTimeUtils.removeTimezoneOffsetFromDeal(deal);
    deal.category_id = defaultCategory;
    deal.imageUrls = await storageService.getDealImages(deal.id, deal.dealer_id);
  }

  return {
    deal
  };
}
