import { deleteHotDeal, findHotDealsByUserId, insertHotDeal } from "$lib/database/deal/deal.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const favoriteDeals = await findHotDealsByUserId(+jwt.sub);

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
    await insertHotDeal(+jwt.sub, +dealId);

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
    await deleteHotDeal(+jwt.sub, +dealId);

    return response();
  } catch (error) {
    console.error("Can't delete favorite:", error);
    return errorResponse();
  }
}
