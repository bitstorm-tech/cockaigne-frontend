import { redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ fetch }: LoadEvent) {
  const accountResponse = await fetch("/api/accounts/");
  const favoritesDealerResponse = await fetch("/api/favorites/dealers");

  if (accountResponse.ok && favoritesDealerResponse.ok) {
    const favoriteDealers = await favoritesDealerResponse.json();
    const account = await accountResponse.json();

    return {
      favoriteDealers,
      account
    };
  }

  redirectToLogin();
}
