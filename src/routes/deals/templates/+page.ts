import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const response = await fetch("/api/deals/templates");

  if (response.ok) {
    const templates = await response.json();
    return {
      templates
    };
  }
}
