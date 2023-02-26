import { browser } from "$app/environment";
import type { Category } from "$lib/database/category/category.model";
import categoryService from "$lib/supabase/category-service";
import { supabase } from "$lib/supabase/supabase-client";
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

    const { data, error } = await supabase.from("categories").select();

    if (error) {
      console.error("Can't fetch categories:", error);
      return;
    }

    const categories = data;
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

    const selectedCategories = await categoryService.getSelectedCategories();
    this.set(selectedCategories);
  },

  save: async function () {
    if (!browser) {
      return console.error("Can't save selected categories -> not in browser!");
    }

    const newSelectedCategoryIds = get(selectedCategories);
    categoryService.upddateSelcetedCateogry(newSelectedCategoryIds);
  }
};
