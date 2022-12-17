import { findRatingsByDealerId } from "$lib/database/rating/rating.service";
import { errorResponse, notFoundResponse, response } from "$lib/http.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params }: RequestEvent) {
  const dealerId = params.dealerId;

  try {
    if (!dealerId) {
      return notFoundResponse();
    }

    const ratings = await findRatingsByDealerId(+dealerId);
    return response(ratings);
  } catch (error) {
    console.error(`Can't get ratings of dealer with id ${dealerId}:`, error);
    return errorResponse();
  }
}
