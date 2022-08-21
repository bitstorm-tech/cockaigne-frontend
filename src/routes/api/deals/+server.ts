import type { Deal } from "$lib/database/deal/deal.model";
import { findAllDeals, findDealsByOwnerId, upsertDeal } from "$lib/database/deal/deal.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const deal: Deal = await request.json();
    deal.account_id = +jwt.sub;

    await upsertDeal(deal);

    return response();
  } catch (error) {
    console.error("Can't post deal:", error);
    return errorResponse();
  }
}

export async function GET({ url }: RequestEvent) {
  try {
    const dealer = url.searchParams.get("dealer")?.toLowerCase();
    const deals = dealer ? await findDealsByOwnerId(+dealer) : await findAllDeals();

    return response(deals);
  } catch (error) {
    console.error("Can't get deals:", error);
    return errorResponse();
  }
}
