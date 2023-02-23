import type { DealFilter } from "$lib/database/deal/deal.model";
import type { Position } from "$lib/geo/geo.types";
import dealService from "$lib/supabase/deal-service";
import type { ActiveDeal } from "$lib/supabase/public-types";
import { writable } from "svelte/store";

const deals = writable<ActiveDeal[]>([]);

export const dealStore = {
  subscribe: deals.subscribe,
  set: deals.set,
  update: deals.update,

  load: async function (location: Position, radius: number, categoryIds: number[]) {
    const filter: DealFilter = {
      location,
      radius,
      categoryIds
    };

    const deals = await dealService.getDealsByFilter(filter);
    this.set(deals);
  }
};
