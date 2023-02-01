import type { Dealer } from "$lib/database/dealer/dealer.model";
import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ fetch, params }: LoadEvent) {
  const id = params.id;

  navigationStore.currentPage("home");

  const [responseDeals, responsePictures, responseFavoriteDealers, responseAccount] = await Promise.all([
    fetch("/api/deals?dealer=" + id),
    fetch("/api/images?dealer=" + id),
    fetch("/api/accounts/favorite-dealers"),
    fetch("/api/accounts/" + id)
  ]);

  if (responseDeals.ok && responsePictures.ok && responseFavoriteDealers && responseAccount.ok) {
    const [deals, pictures, favoriteDealers, account] = await Promise.all([
      responseDeals.json(),
      responsePictures.json(),
      responseFavoriteDealers.json(),
      responseAccount.json()
    ]);

    return {
      deals,
      pictures,
      dealerId: id,
      account,
      favoriteDealers: favoriteDealers.map((dealer: Dealer) => dealer.id)
    };
  }

  redirectToLogin();
}
