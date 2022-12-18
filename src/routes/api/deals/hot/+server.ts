import { deleteHotDeal, findHotDealIds, insertHotDeal } from "$lib/database/hot/hot.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request, url }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const dealId = +(url.searchParams.get("id") || -1);
    const hotDealIds = await findHotDealIds(+jwt.sub);

    hotDealIds.includes(dealId) ? await deleteHotDeal(+jwt.sub, dealId) : await insertHotDeal(+jwt.sub, +dealId);

    return response();
  } catch (error) {
    console.error("Can't toggle hot deal:", error);
    return errorResponse();
  }
}
