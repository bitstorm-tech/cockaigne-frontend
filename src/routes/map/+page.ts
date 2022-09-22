import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, url }: LoadEvent) {
  const response = await fetch("/api/categories");
  const showDealFilterModal = url.searchParams.get("showFilter") || false;

  if (response.ok) {
    const categories = await response.json();

    return {
      categories,
      showDealFilterModal
    };
  }
}
