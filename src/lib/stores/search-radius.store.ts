import { getUserId, supabase } from "$lib/supabase/supabase-client";
import { writable } from "svelte/store";

const searchRadius = writable<number>(500);

export const searchRadiusStore = {
  subscribe: searchRadius.subscribe,
  update: searchRadius.update,
  set: searchRadius.set,

  load: async function () {
    const { data } = await supabase.from("accounts").select("search_radius").single();

    if (data && data.search_radius) {
      this.set(data.search_radius);
    }
  },

  save: async function (radius: number) {
    const userId = await getUserId();

    if (!userId) return;

    await supabase.from("accounts").update({ search_radius: radius }).eq("id", userId);
    this.set(radius);
  }
};
