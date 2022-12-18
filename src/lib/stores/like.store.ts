import { xor } from "lodash";
import { writable } from "svelte/store";

const likedDealIds = writable<number[]>([]);

export const likeStore = {
  subscribe: likedDealIds.subscribe,
  update: likedDealIds.update,
  set: likedDealIds.set,

  load: async function () {
    const response = await fetch("/api/deals/likes");

    if (response.ok) {
      const ids: number[] = await response.json();
      this.set(ids);
    }
  },

  toggleLike: function (dealId: number) {
    this.update((oldLikes) => xor(oldLikes, [dealId]));
  }
};
