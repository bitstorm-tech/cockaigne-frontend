import type { Dealer } from "$lib/database/dealer/dealer.model";
import { redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ fetch, params }: LoadEvent) {
  const id = params.id;

  const [responseDeals, responsePictures, responseFavoriteDealers, responseAccount] = await Promise.all([
    fetch("/api/deals?dealer=" + id),
    fetch("/api/images?dealer=" + id),
    fetch("/api/accounts/favorite-dealers"),
    fetch("/api/accounts/" + id)
  ]);

  if (responseDeals.ok && responsePictures.ok && responseFavoriteDealers && responseAccount.ok) {
    const deals = await responseDeals.json();
    const pictures = await responsePictures.json();
    const favoriteDealers = await responseFavoriteDealers.json();
    const account = await responseAccount.json();

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
