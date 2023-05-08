import { munichPosition } from "$lib/geo/geo.types";
import { writable } from "svelte/store";

const location = writable(munichPosition);

export const locationStore = {
  subscribe: location.subscribe,
  update: location.update,
  set: location.set
};
