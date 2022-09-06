import { redirectToLogin } from "$lib/http.service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const dealsResponse = await fetch("/api/deals");
  const accountResponse = await fetch("/api/accounts/");
  const favoritesDealsResponse = await fetch("/api/favorites/deals");
  const favoritesDealerResponse = await fetch("/api/favorites/dealers");

  if (dealsResponse.ok && accountResponse.ok && favoritesDealsResponse.ok && favoritesDealerResponse.ok) {
    const favoriteDeals = await favoritesDealsResponse.json();
    const favoriteDealers = await favoritesDealerResponse.json();
    const account = await accountResponse.json();
    const deals = await dealsResponse.json();

    return {
      deals,
      favoriteDeals,
      favoriteDealers,
      account
    };
  }

  redirectToLogin();
}