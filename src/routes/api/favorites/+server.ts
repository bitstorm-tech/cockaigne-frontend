import { findFavoriteDealsByAccountId } from "$lib/database/deal/deal.service";
import { deleteFavorite, insertFavorite } from "$lib/database/favorite/favorite.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const favoriteDeals = await findFavoriteDealsByAccountId(+jwt.sub);

    return response(favoriteDeals);
  } catch (error) {
    console.error("Can't get favorite deals:", error);
    return errorResponse();
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const dealId = await request.text();
    await insertFavorite(+jwt.sub, +dealId);

    return response();
  } catch (error) {
    console.error("Can't post favorite:", error);
    return errorResponse();
  }
}

export async function DELETE({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const dealId = await request.text();
    await deleteFavorite(+jwt.sub, +dealId);

    return response();
  } catch (error) {
    console.error("Can't delete favorite:", error);
    return errorResponse();
  }
}
