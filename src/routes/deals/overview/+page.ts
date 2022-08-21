import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const response = await fetch("/api/deals?filter=own");

  if (response.ok) {
    const deals = await response.json();
    return {
      deals
    };
  }
}
