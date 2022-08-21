import { redirectToLogin } from "$lib/http.service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const dealsResponse = await fetch("/api/deals");
  const accountResponse = await fetch("/api/accounts/");
  const favoritesResponse = await fetch("/api/favorites");

  if (dealsResponse.ok && accountResponse.ok && favoritesResponse.ok) {
    const favoriteDeals = await favoritesResponse.json();
    const account = await accountResponse.json();
    const deals = await dealsResponse.json();

    return {
      deals,
      favoriteDeals,
      account
    };
  }

  redirectToLogin();
}
