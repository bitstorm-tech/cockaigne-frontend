import { munichPosition, toPostGisPoint, type Position } from "$lib/geo/geo.types";
import { getUserId, supabase } from "$lib/supabase/supabase-client";
import { get, writable } from "svelte/store";

const location = writable<Position>(munichPosition);

export const locationStore = {
  subscribe: location.subscribe,
  update: location.update,
  set: location.set,

  load: async function () {
    const { data } = await supabase.from("accounts").select().single();

    if (!data) {
      console.log("Location:", data);
    }
  },

  save: async function () {
    const userId = await getUserId();

    if (!userId) return;

    const position = get(location);
    const point = toPostGisPoint(position);
    await supabase.from("accounts").update({ location: point }).eq("id", userId);
  }
};
