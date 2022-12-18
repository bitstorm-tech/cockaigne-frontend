import type { Rating } from "$lib/database/rating/rating.model";
import { insertRating } from "$lib/database/rating/rating.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const rating: Rating = await request.json();
    rating.account_id = +jwt.sub;

    console.log("Insert rating:", rating);

    const insertedRating = await insertRating(rating);
    return response(insertedRating);
  } catch (error) {
    console.error("Can't post rating:", error);
    return errorResponse();
  }
}
