import dealService from "$lib/supabase/deal-service";
import type { ActiveDeal } from "$lib/supabase/public-types";
import { remove } from "lodash";
import { get, writable } from "svelte/store";

const hotDeals = writable<ActiveDeal[]>([]);

export const hotDealStore = {
  subscribe: hotDeals.subscribe,
  set: hotDeals.set,
  update: hotDeals.update,

  load: async function () {
    const hotDeals = await dealService.getHotDeals();
    hotDeals.forEach((deal) => (deal.isHot = true));
    this.set(hotDeals);
  },

  toggleHot: async function (dealId: string) {
    const hotDeal = await dealService.toggleHotDeal(dealId);

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
  }
};
