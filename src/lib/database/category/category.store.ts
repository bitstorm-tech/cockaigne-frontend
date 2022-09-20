import { browser } from "$app/environment";
import type { Category } from "$lib/database/category/category.model";
import { writable } from "svelte/store";

const { subscribe, update, set } = writable<Category[]>([]);

export const categoryStore = {
  subscribe,
  update,
  set,

  load: async function () {
    if (!browser) {
      return;
    }

    const response = await fetch("/api/categories");

    if (!response.ok) {
      console.error("Can't fetch categories:", response.status, response.statusText);
      return;
    }

    const categories = await response.json();
    set(categories);
  }
};
