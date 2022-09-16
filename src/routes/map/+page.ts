import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const response = await fetch("/api/categories");

  if (response.ok) {
    const categories = await response.json();

    return {
      categories
    };
  }
}
