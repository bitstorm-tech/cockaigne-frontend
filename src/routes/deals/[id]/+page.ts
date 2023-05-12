import DateTimeUtils from "$lib/date-time.utils";
import { getDefaultCategory } from "$lib/supabase/account-service";
import { getDeal, newDeal } from "$lib/supabase/deal-service";
import { getDealImages } from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, url, parent }: LoadEvent) {
  const id = params.id;
  const { supabase, session } = await parent();

  if (!id) {
    return;
  }

  const defaultCategory = await getDefaultCategory(supabase, session.user.id);

  if (id.toLowerCase() === "new") {
    const deal = newDeal();
    const dealerId = url.searchParams.get("dealerId");
    if (dealerId) {
      deal.category_id = defaultCategory;
      deal.dealer_id = dealerId;
    }
    return { deal };
  }

  const deal = await getDeal(id);
  if (deal) {
    DateTimeUtils.removeTimezoneOffsetFromDeal(deal);
    deal.category_id = defaultCategory;
    deal.imageUrls = await getDealImages(supabase, deal.id, deal.dealer_id);
  }

  return {
    deal
  };
}
