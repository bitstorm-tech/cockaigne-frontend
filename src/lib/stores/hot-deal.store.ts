import { browser } from "$app/environment";
import { page } from "$app/stores";
import { getHotDeals, rotateByCurrentTime, toggleHotDeal } from "$lib/supabase/deal-service";
import type { ActiveDeal } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";
import remove from "lodash/remove";
import { get, writable } from "svelte/store";

const hotDeals = writable<ActiveDeal[]>([]);

export const hotDealStore = {
  subscribe: hotDeals.subscribe,
  set: hotDeals.set,
  update: hotDeals.update,

  load: async function (supabase: Supabase, userId: string) {
    if (!browser) {
      throw Error("Init store (hot deals) on server -> potential information leak!");
    }

    const hotDeals = await getHotDeals(supabase, userId);
    hotDeals.forEach((deal) => (deal.isHot = true));
    this.set(hotDeals);
  },

  toggleHot: async function (dealId: string) {
    const supabase = get(page).data.supabase;
    const userId = get(page).data.userId;

    if (!userId) return;

    const hotDeal = await toggleHotDeal(supabase, userId, dealId);

    if (hotDeal) {
      hotDeal.isHot = true;
      this.update((deals) => [...deals, hotDeal]);
    } else {
      this.update((deals) => {
        remove(deals, (deal) => deal.id === dealId);
        return deals;
      });
    }
  },

  updateHotFlag: function (deals: ActiveDeal[]): ActiveDeal[] {
    const _hotDeals = get(hotDeals);
    deals.forEach((deal) => (deal.isHot = _hotDeals.some((hotDeal) => hotDeal.id === deal.id)));
    return deals;
  },

  rotateByCurrentTime: function () {
    const rotatedDeals = rotateByCurrentTime(get(hotDeals));
    this.set(rotatedDeals);
  }
};
