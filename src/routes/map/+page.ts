import { getCategories } from "$lib/supabase/category-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ url, parent }: LoadEvent) {
  const { supabase, session } = await parent();
  const showDealFilterModal = url.searchParams.get("showFilter") || false;
  const categories = await getCategories(supabase);

  return {
    categories,
    showDealFilterModal
  };
}
