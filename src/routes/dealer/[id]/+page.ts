import { redirectToLogin } from "$lib/http.service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch, params }: LoadEvent) {
  const id = params.id;
  const responseDeals = await fetch("/api/deals?dealer=" + id);
  const responsePictures = await fetch("/api/pictures?dealer=" + id);

  if (responseDeals.ok && responsePictures.ok) {
    const deals = await responseDeals.json();
    const pictures = await responsePictures.json();
    return {
      deals,
      pictures
    };
  }

  redirectToLogin();
}
