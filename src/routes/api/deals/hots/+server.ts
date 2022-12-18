import { findHotDealIds } from "$lib/database/hot/hot.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const favoriteDeals = await findHotDealIds(+jwt.sub);

    return response(favoriteDeals);
  } catch (error) {
    console.error("Can't get favorite deals:", error);
    return errorResponse();
  }
}
