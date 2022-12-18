import { browser } from "$app/environment";
import type { AccountUpdateOptions } from "$lib/database/account/account.model";
import type { Category } from "$lib/database/category/category.model";
import { PUT } from "$lib/http.utils";
import { get, writable } from "svelte/store";

const categories = writable<Category[]>([]);

export const categoryStore = {
  subscribe: categories.subscribe,
  update: categories.update,
  set: categories.set,

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
    this.set(categories);
  }
};

const selectedCategories = writable<number[]>([]);

export const selectedCategoriesStore = {
  subscribe: selectedCategories.subscribe,
  update: selectedCategories.update,
  set: selectedCategories.set,

  load: async function () {
    if (!browser) {
      return console.error("Can't load selected categories -> not in browser!");
    }

    const response = await fetch("/api/accounts");

    if (!response.ok) {
      console.error("Can't fetch selected categories of account:", response.status, response.statusText);
      return;
    }

    const account = await response.json();
    this.set(account.selected_categories);
  },

  save: async function () {
    if (!browser) {
      return console.error("Can't save selected categories -> not in browser!");
    }

    const updateOptions: AccountUpdateOptions = {
      selected_categories: get(selectedCategories)
    };

    const response = await fetch("/api/accounts", PUT(updateOptions));

    if (!response.ok) {
      console.error("Can't save selected categories:", response.status, response.statusText);
    }
  }
};
