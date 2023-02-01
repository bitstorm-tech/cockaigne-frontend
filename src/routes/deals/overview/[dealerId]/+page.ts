import { navigationStore } from "$lib/stores/navigation.store";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  navigationStore.currentPage("dealOverview");
  const response = await fetch("/api/deals?dealer=" + params.dealerId);

  if (response.ok) {
    const deals = await response.json();
    return {
      deals
    };
  }
}
