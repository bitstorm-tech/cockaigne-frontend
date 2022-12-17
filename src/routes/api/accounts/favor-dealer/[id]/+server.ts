import { toggleFavoriteDealer } from "$lib/database/dealer/dealer.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request, params }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      console.warn("Can't get account -> no JWT present");
      return unauthorizedResponse();
    }

    const dealerId = params.id || -1;
    const accountId = jwt.sub;

    const favoriteDealers = await toggleFavoriteDealer(+accountId, +dealerId);
    return response(favoriteDealers);
  } catch (error) {
    console.error("Can't toggle favorite dealer:", error);
    return errorResponse();
  }
}
