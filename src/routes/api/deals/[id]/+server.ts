import { deleteDealById, findDealById } from "$lib/database/deal/deal.service";
import { errorResponse, forbiddenResponse, notFoundResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params, request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const id = params.id || -1;
    const deal = await findDealById(+id);

    if (!deal) {
      return notFoundResponse();
    }

    if (deal.account_id !== +jwt.sub) {
      return forbiddenResponse();
    }

    return response(deal);
  } catch (error) {
    console.error("Can't get deal:", error);
    return errorResponse();
  }
}

export async function DELETE({ params, request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const id = params.id || -1;
    const deal = await findDealById(+id);

    if (!deal) {
      return notFoundResponse();
    }

    if (deal.account_id !== +jwt.sub) {
      return forbiddenResponse();
    }

    await deleteDealById(deal.id);

    return response();
  } catch (error) {
    console.error("Can't delete deal:", error);
    return errorResponse();
  }
}
