import { findFavoriteDealersByAccountId } from "$lib/database/deal/deal.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const favoriteDealers = await findFavoriteDealersByAccountId(+jwt.sub);

    return response(favoriteDealers);
  } catch (error) {
    console.error("Can't get favorite dealers:", error);
    return errorResponse();
  }
}
