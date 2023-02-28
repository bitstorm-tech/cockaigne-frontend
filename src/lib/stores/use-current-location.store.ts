import { getUserId, supabase } from "$lib/supabase/supabase-client";
import { get, writable } from "svelte/store";

const useCurrentLocation = writable<boolean>(false);

export const useCurrentLocationStore = {
  subscribe: useCurrentLocation.subscribe,
  update: useCurrentLocation.update,
  set: useCurrentLocation.set,

  load: async function (): Promise<boolean> {
    const { data } = await supabase.from("accounts").select("use_current_location").single();
    const useCurrentLocation = data?.use_current_location || false;
    this.set(useCurrentLocation);

    return useCurrentLocation;
  },

  save: async function () {
    const userId = await getUserId();

    if (!userId) return;

    const use_current_location = get(useCurrentLocation);

    await supabase.from("accounts").update({ use_current_location }).eq("id", userId);
  }
};
