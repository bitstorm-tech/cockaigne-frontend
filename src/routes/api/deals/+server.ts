import type { Deal } from "$lib/database/deal/deal.model";
import { findDealsByDealerId, upsertDeal } from "$lib/database/deal/deal.service";
import { badRequestResponse, errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const deal: Deal = await request.json();
    deal.dealer_id = +jwt.sub;

    await upsertDeal(deal);

    return response();
  } catch (error) {
    console.error("Can't post deal:", error);
    return errorResponse();
  }
}

export async function GET({ url }: RequestEvent) {
  try {
    const dealerId = url.searchParams.get("dealer");

    if (!dealerId) {
      return badRequestResponse();
    }

    const deals = await findDealsByDealerId(+dealerId);

    return response(deals);
  } catch (error) {
    console.error("Can't get deals:", error);
    return errorResponse();
  }
}
