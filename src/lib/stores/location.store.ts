import { centerOfGermany } from "$lib/geo/geo.types";
import { writable } from "svelte/store";

const location = writable(centerOfGermany);

export const locationStore = {
  subscribe: location.subscribe,
  update: location.update,
  set: location.set
};
