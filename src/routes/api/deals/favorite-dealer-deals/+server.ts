import { findDealsOfFavoriteDealers } from "$lib/database/deal/deal.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.utils";
import { getImageUrls } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const deals = await findDealsOfFavoriteDealers(+jwt.sub);

    for (const deal of deals) {
      deal.imageUrls = await getImageUrls(deal.dealer_id, deal.id);
    }

    return response(deals);
  } catch (error) {
    console.error("Can't get favorite dealer deals:", error);
    return errorResponse();
  }
}
