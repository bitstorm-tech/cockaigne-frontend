import { browser } from "$app/environment";
import { getSearchRadius } from "$lib/supabase/location-service";
import type { Supabase } from "$lib/supabase/supabase-client";
import { writable } from "svelte/store";

const searchRadius = writable(500);

export const searchRadiusStore = {
  set: searchRadius.set,
  update: searchRadius.update,
  subscribe: searchRadius.subscribe,

  load: async function(supabase: Supabase, userId?: string) {
    if (!browser) {
      throw Error("Init store (radius) on server -> potential information leak!");
    }

    if (!userId) return;

    const searchRadius = await getSearchRadius(supabase, userId);
    this.set(searchRadius);
  }
}