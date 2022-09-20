import { writable } from "svelte/store";
import type { Position } from "../../geo/geo.types";
import { POST } from "../../http.service";
import type { Deal } from "./deal.model";

const { subscribe, set, update } = writable<Deal[]>([]);

export const dealStore = {
  subscribe,
  set,
  update,

  loadFiltered: async function (location: Position, radius: number) {
    const response = await fetch(
      "/api/deals/filter",
      POST({
        location,
        radius
      })
    );

    if (!response.ok) {
      console.error("Can't fetch filtered deals:", response.status, response.statusText);
      return;
    }

    const deals = await response.json();
    set(deals);
  }
};
