import dealService from "$lib/supabase/deal-service";
import locationService from "$lib/supabase/location-service";
import type { ActiveDeal } from "$lib/supabase/public-types";
import { writable } from "svelte/store";

const deals = writable<ActiveDeal[]>([]);

export const dealStore = {
  subscribe: deals.subscribe,
  set: deals.set,
  update: deals.update,

  load: async function () {
    const filter = await locationService.createFilterByCurrentLocationAndSelectedCategories();
    const deals = await dealService.getDealsByFilter(filter);
    this.set(deals);
  }
};
