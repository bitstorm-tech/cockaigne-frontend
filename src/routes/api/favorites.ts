import { findFavoriteDealsByAccountId } from "$lib/database/deal/deal.service";
import { deleteFavorite, insertFavorite } from "$lib/database/favorite/favorite.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function get({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const favoriteDeals = await findFavoriteDealsByAccountId(+jwt.sub);

    return {
      status: 200,
      body: favoriteDeals
    };
  } catch (error) {
    console.error("Can't get favorite deals:", error);
    return {
      status: 500
    };
  }
}

export async function post({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const dealId = await request.text();
    await insertFavorite(+jwt.sub, +dealId);

    return {
      status: 200
    };
  } catch (error) {
    console.error("Can't post favorite:", error);
    return {
      status: 500
    };
  }
}

export async function del({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const dealId = await request.text();
    await deleteFavorite(+jwt.sub, +dealId);

    return {
      status: 200
    };
  } catch (error) {
    console.error("Can't delete favorite:", error);
    return {
      status: 500
    };
  }
}
