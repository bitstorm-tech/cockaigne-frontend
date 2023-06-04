import { browser } from "$app/environment";
import { page } from "$app/stores";
import { selectedCategoriesStore } from "$lib/stores/category.store";
import { locationStore } from "$lib/stores/location.store";
import { searchRadiusStore } from "$lib/stores/search-radius.store";
import { getDealsByFilter, rotateByCurrentTime } from "$lib/supabase/deal-service";
import { createFilterByCurrentLocationAndSelectedCategories } from "$lib/supabase/location-service";
import type { ActiveDeal, DealFilter } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";
import debounce from "lodash/debounce";
import { get, writable } from "svelte/store";

const deals = writable<ActiveDeal[]>([]);

export const dealStore = {
  subscribe: deals.subscribe,
  set: deals.set,
  update: deals.update,

  load: async function (supabase: Supabase, userId: string) {
    if (!browser) {
      throw Error("Init store (deals) on server -> potential information leak!");
    }

    const filter = await createFilterByCurrentLocationAndSelectedCategories(supabase, userId);
    const deals = await getDealsByFilter(supabase, filter);
    this.set(deals);
  },

  rotateByCurrentTime: function () {
    const rotatedDeals = rotateByCurrentTime(get(deals));
    this.set(rotatedDeals);
  },

  updateByCurrentFilters: debounce(async () => {
    if (!browser) return;

    const supabase = get(page).data.supabase;
    const searchRadius = get(searchRadiusStore);
    const location = get(locationStore);

    const filter: DealFilter = {
      categoryIds: get(selectedCategoriesStore),
      location,
      radius: searchRadius
    };

    const deals = await getDealsByFilter(supabase, filter);
    dealStore.set(deals);
  }, 1000)
};
