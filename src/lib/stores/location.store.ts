import { centerOfGermany } from "$lib/geo/geo.types";
import { getLocation } from "$lib/supabase/location-service";
import type { Supabase } from "$lib/supabase/supabase-client";
import { writable } from "svelte/store";

const location = writable(centerOfGermany);

export const locationStore = {
  subscribe: location.subscribe,
  update: location.update,
  set: location.set,

  load: async function(supabase: Supabase, userId?: string) {
    if (!userId) return;
    const location = await getLocation(supabase, userId);
    this.set(location);
  }
};
