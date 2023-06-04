import type { Supabase } from "$lib/supabase/supabase-client";
import type { Category } from "./public-types";

export async function getCategories(supabase: Supabase): Promise<Category[]> {
  const { data } = await supabase.from("categories").select();

  if (!data) {
    return [];
  }

  return data;
}

export async function getSelectedCategories(supabase: Supabase, userId: string): Promise<number[]> {
  const { data } = await supabase.from("selected_categories").select("category_id").eq("user_id", userId);

  if (!data) {
    return [];
  }
  return data.map((selectedCategory) => selectedCategory.category_id);
}

export async function updateSelectedCategory(supabase: Supabase, userId: string, newCategoryIds: number[]) {
  await supabase.from("selected_categories").delete().eq("user_id", userId);

  const inserts = newCategoryIds.map((categoryId) => {
    return { user_id: userId, category_id: categoryId };
  });

  await supabase.from("selected_categories").insert(inserts);
}
