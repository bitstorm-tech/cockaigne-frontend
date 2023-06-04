import { logError } from "$lib/error-utils";
import { getSelectedCategories } from "$lib/supabase/category-service";
import type { Category } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";
import { writable } from "svelte/store";

const categories = writable<Category[]>([]);

export const categoryStore = {
  subscribe: categories.subscribe,
  update: categories.update,
  set: categories.set,

  load: async function (supabase: Supabase) {
    const { data, error } = await supabase.from("categories").select();

    if (error) {
      return logError(error, "Can't fetch categories");
    }

    this.set(data);
  }
};

const selectedCategories = writable<number[]>([]);

export const selectedCategoriesStore = {
  subscribe: selectedCategories.subscribe,
  update: selectedCategories.update,
  set: selectedCategories.set,

  load: async function (supabase: Supabase, userId: string) {
    const selectedCategories = await getSelectedCategories(supabase, userId);
    this.set(selectedCategories);
  }
};
