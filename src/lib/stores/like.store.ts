import { xor } from "lodash";
import { get, writable } from "svelte/store";

const likedDealIds = writable<number[]>([]);

export const likeStore = {
  subscribe: likedDealIds.subscribe,
  update: likedDealIds.update,
  set: likedDealIds.set,

  load: async function () {
    const response = await fetch("/api/likes");

    if (response.ok) {
      const ids: number[] = await response.json();
      this.set(ids);
    }
  },

  isDealLiked: function (dealId: number): boolean {
    return get(likedDealIds).includes(dealId);
  },

  toggleLike: function (dealId: number) {
    this.update((oldLikes) => {
      return xor(oldLikes, [dealId]);
    });
  }
};
