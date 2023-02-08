import type { Account } from "$lib/database/account/account.model";
import { newDeal, type Deal } from "$lib/database/deal/deal.model";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, fetch, url }: LoadEvent) {
  if (params.id?.toLowerCase() === "new") {
    const deal = newDeal();
    const dealerId = url.searchParams.get("dealerId");
    if (dealerId) {
      const response = await fetch("/api/accounts/" + dealerId);
      const account: Account = await response.json();
      deal.category_id = account.default_category;
    }
    delete deal.id;
    return { deal };
  }

  const response = await fetch(`/api/deals/${params.id}`);
  const deal: Deal = await response.json();

  deal.duration = deal.duration.toString();

  return {
    deal
  };
}
