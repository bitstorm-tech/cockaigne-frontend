import type { Dealer } from "$lib/database/dealer/dealer.model";
import { redirectToLogin } from "$lib/http.service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  const id = params.id;
  const responseDeals = await fetch("/api/deals?dealer=" + id);
  const responsePictures = await fetch("/api/pictures?dealer=" + id);
  const responseFavoriteDealers = await fetch("/api/accounts/favorite-dealers");
  const responseAccount = await fetch("/api/accounts/" + id);

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
