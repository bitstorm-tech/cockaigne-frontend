import { findFavoriteDealersByAccountId } from "$lib/database/favorite/favorite.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      console.warn("Can't get account -> no JWT present");
      return unauthorizedResponse();
    }

    const accountId = +jwt.sub;

    const favoriteDealers = await findFavoriteDealersByAccountId(+accountId);
    return response(favoriteDealers);
  } catch (error) {
    console.error("Can't get favorite dealers:", error);
    return errorResponse();
  }
}
