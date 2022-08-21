import type { LoadEvent } from "@sveltejs/kit";
import { redirectToLogin } from "../../../lib/http.service";

export async function load({ fetch }: LoadEvent) {
  const responseDeals = await fetch("/api/deals?filter=own");
  const responsePictures = await fetch("/api/pictures");

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
