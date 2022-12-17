import { findTemplateDealsByDealerId } from "$lib/database/deal/deal.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const templateDeals = await findTemplateDealsByDealerId(+jwt.sub);

    return response(templateDeals);
  } catch (error) {
    console.error("Can't get templates:", error);
    return errorResponse();
  }
}
