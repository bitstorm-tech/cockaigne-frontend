import { supabase } from "$lib/supabase/supabase-client";
import type { LoadEvent } from "@sveltejs/kit";

export let ssr = false;

export async function load({ fetch, url }: LoadEvent) {
  const showDealFilterModal = url.searchParams.get("showFilter") || false;
  const { data } = await supabase.from("categories").select();

  const categories = data || [];

  return {
    categories,
    showDealFilterModal
  };
}
