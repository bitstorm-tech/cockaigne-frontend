import { redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";
import { navigationStore } from "../../lib/stores/navigation.store";

export const ssr = false;

export async function load({ fetch }: LoadEvent) {
  navigationStore.currentPage("home");

  const [accountResponse, favoriteDealerResponse, favoriteDealerDealsResponse] = await Promise.all([
    fetch("/api/accounts/"),
    fetch("/api/favorites/dealers"),
    fetch("/api/deals/favorite-dealer-deals")
  ]);

  if (accountResponse.ok && favoriteDealerResponse.ok && favoriteDealerDealsResponse.ok) {
    const [account, favoriteDealers, favoriteDealerDeals] = await Promise.all([
      accountResponse.json(),
      favoriteDealerResponse.json(),
      favoriteDealerDealsResponse.json()
    ]);

    return {
      account,
      favoriteDealers,
      favoriteDealerDeals
    };
  }

  redirectToLogin();
}
