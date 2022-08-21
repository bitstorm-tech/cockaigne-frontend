import { newDeal } from "$lib/database/deal/deal.model";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, fetch }: LoadEvent) {
  if (params.id?.toLowerCase() === "new") {
    return newDeal();
  }

  const response = await fetch(`/api/deals/${params.id}`);
  const deal = await response.json();

  deal.start = deal.start.substring(0, 16);
  deal.duration = deal.duration.toString();

  return {
    ...deal
  };
}
