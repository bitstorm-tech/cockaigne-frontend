import { removeTimezoneOffsetFromDeal } from "$lib/date-time.utils";
import { getDefaultCategory } from "$lib/supabase/account-service";
import { getDeal, newDeal } from "$lib/supabase/deal-service";
import { getDealImages } from "$lib/supabase/storage-service";
import { hasActiveSubscription } from "$lib/supabase/subscription-service";
import { hasActiveVouchers } from "$lib/supabase/voucher-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, url, parent }: LoadEvent) {
  const id = params.id;
  const { supabase, session } = await parent();

  if (!id) {
    return;
  }

  const defaultCategory = await getDefaultCategory(supabase, session.user.id);
  const activeVouchers = await hasActiveVouchers(supabase, session.user.id);
  const activeSubscription = await hasActiveSubscription(supabase, session.user.id);

  if (id.toLowerCase() === "new") {
    const deal = newDeal();
    const dealerId = url.searchParams.get("dealerId");
    if (dealerId) {
      deal.category_id = defaultCategory;
      deal.dealer_id = dealerId;
    }
    return { deal, activeVouchers, activeSubscription };
  }

  const deal = await getDeal(supabase, id);
  if (deal) {
    removeTimezoneOffsetFromDeal(deal);
    deal.category_id = defaultCategory;
    deal.imageUrls = await getDealImages(supabase, deal.id, deal.dealer_id);
  }

  return {
    deal,
    activeVouchers,
    activeSubscription
  };
}
