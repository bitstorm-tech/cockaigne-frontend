import type { Deal } from "$lib/database/deal/deal.model";
import { findDealsByDealerId, upsertDeal } from "$lib/database/deal/deal.service";
import { errorResponse, notFoundResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import { saveDealImage } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const data = await request.json();
    const deal: Deal = data.deal;
    deal.dealer_id = +jwt.sub;

    const dealId = await upsertDeal(deal);

    for (let i = 0; i < data.imagesAsBase64.length; i++) {
      const base64 = data.imagesAsBase64[i];
      saveDealImage(base64, i.toString(), deal.dealer_id, dealId).then();
    }

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
      return notFoundResponse();
    }

    const deals = await findDealsByDealerId(+dealerId);

    return response(deals);
  } catch (error) {
    console.error("Can't get deals:", error);
    return errorResponse();
  }
}
