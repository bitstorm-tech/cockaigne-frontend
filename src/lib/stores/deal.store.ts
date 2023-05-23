import { browser } from "$app/environment";
import { page } from "$app/stores";
import { getDealsByFilter, rotateByCurrentTime } from "$lib/supabase/deal-service";
import { createFilterByCurrentLocationAndSelectedCategories } from "$lib/supabase/location-service";
import type { ActiveDeal } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";
import { get, writable } from "svelte/store";

const deals = writable<ActiveDeal[]>([]);

export const dealStore = {
  subscribe: deals.subscribe,
  set: deals.set,
  update: deals.update,

  load: async function (supabase: Supabase, userId?: string) {
    if (!browser) {
      throw Error("Init store (deals) on server -> potential information leak!");
    }

    if (!userId) {
      this.set([]);
      return;
    }

    const filter = await createFilterByCurrentLocationAndSelectedCategories(supabase, userId);
    const deals = await getDealsByFilter(supabase, filter);
    this.set(deals);
  },

  rotateByCurrentTime: function () {
    const rotatedDeals = rotateByCurrentTime(get(deals));
    this.set(rotatedDeals);
  }
};
