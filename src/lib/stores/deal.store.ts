import type { Deal, DealFilter } from "$lib/database/deal/deal.model";
import { getDealsByFilter } from "$lib/deal.utils";
import type { Position } from "$lib/geo/geo.types";
import { writable } from "svelte/store";

const deals = writable<Deal[]>([]);

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

    const deals = await getDealsByFilter(filter);
    this.set(deals);
  }
};
