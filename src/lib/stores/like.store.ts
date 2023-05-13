import type { Supabase } from "$lib/supabase/supabase-client";
import { xor } from "lodash";
import { writable } from "svelte/store";

const likedDealIds = writable<string[]>([]);

export const likeStore = {
  subscribe: likedDealIds.subscribe,
  update: likedDealIds.update,
  set: likedDealIds.set,

  load: async function (supabase: Supabase) {
    const { data } = await supabase.from("likes").select("deal_id");

    if (data) {
      this.set(data.map((like) => like.deal_id));
    }
  },

  toggleLike: function (dealId: string) {
    this.update((oldLikes) => xor(oldLikes, [dealId]));
  }
};
