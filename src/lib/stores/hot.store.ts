import { xor } from "lodash";
import { writable } from "svelte/store";

const hotDealIds = writable<number[]>([]);

export const hotStore = {
  subscribe: hotDealIds.subscribe,
  update: hotDealIds.update,
  set: hotDealIds.set,

  load: async function () {
    const response = await fetch("/api/deals/hots");

    if (response.ok) {
      const ids: number[] = await response.json();
      this.set(ids);
    }
  },

  toggleHotDeal: function (dealId: number) {
    this.update((oldLikes) => xor(oldLikes, [dealId]));
    fetch("/api/deals/hot?id=" + dealId).then();
  }
};
