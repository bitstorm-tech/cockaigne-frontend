import { writable } from "svelte/store";
import type { Deal } from "../database/deal/deal.model";
import type { Position } from "../geo/geo.types";
import { POST } from "../http.service";

const { subscribe, set, update } = writable<Deal[]>([]);

export const dealsStore = {
  subscribe,
  set,
  update,

  filterDeals: async function (location: Position, radius: number) {
    const response = await fetch(
      "/api/deals/filter",
      POST({
        location,
        radius
      })
    );

    if (!response.ok) {
      return;
    }

    const deals = await response.json();
    set(deals);
  }
};
