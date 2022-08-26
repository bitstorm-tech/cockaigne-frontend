import type { Dealer } from "$lib/database/dealer/dealer.model";
import { redirectToLogin } from "$lib/http.service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  const id = params.id;
  const responseDeals = await fetch("/api/deals?dealer=" + id);
  const responsePictures = await fetch("/api/pictures?dealer=" + id);
  const responseFavoriteDealers = await fetch("/api/accounts/favorite-dealers");

  if (responseDeals.ok && responsePictures.ok && responseFavoriteDealers) {
    const deals = await responseDeals.json();
    const pictures = await responsePictures.json();
    const favoriteDealers = await responseFavoriteDealers.json();

    return {
      deals,
      pictures,
      dealerId: id,
      favoriteDealers: favoriteDealers.map((dealer: Dealer) => dealer.id)
    };
  }

  redirectToLogin();
}
