import { getDealsByFilter } from "$lib/deal.service";
import type { Position } from "$lib/geo/geo.types";
import { writable } from "svelte/store";
import type { Deal, DealFilter } from "./deal.model";

const { subscribe, set, update } = writable<Deal[]>([]);

export const dealStore = {
  subscribe,
  set,
  update,

  load: async function (location: Position, radius: number, categoryIds: number[]) {
    const filter: DealFilter = {
      location,
      radius,
      categoryIds
    };

    const deals = await getDealsByFilter(filter);
    set(deals);
  }
};
