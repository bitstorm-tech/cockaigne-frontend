import dealService from "$lib/supabase/deal-service";
import { supabase } from "$lib/supabase/supabase-client";
import { xor } from "lodash";
import { writable } from "svelte/store";

const hotDealIds = writable<string[]>([]);

export const hotStore = {
  subscribe: hotDealIds.subscribe,
  update: hotDealIds.update,
  set: hotDealIds.set,

  load: async function () {
    const { data } = await supabase.from("hot_deals").select("deal_id");

    if (data) {
      this.set(data.map((hotDeal) => hotDeal.deal_id));
    }
  },

  toggleHotDeal: function (dealId: string) {
    this.update((oldLikes) => xor(oldLikes, [dealId]));
    dealService.toggleHotDeal(dealId);
  }
};
