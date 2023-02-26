import categoryService from "$lib/supabase/category-service";
import type { LoadEvent } from "@sveltejs/kit";

export let ssr = false;

export async function load({ url }: LoadEvent) {
  const showDealFilterModal = url.searchParams.get("showFilter") || false;
  const categories = await categoryService.getCategories();

  return {
    categories,
    showDealFilterModal
  };
}
