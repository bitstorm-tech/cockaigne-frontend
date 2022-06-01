import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";
import { findDealById } from "../../../lib/database/deal/deal.service";

export async function get({ params, request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      return {
        status: 403
      };
    }

    const deal = await findDealById(+params.id);

    if (!deal) {
      return {
        status: 404
      };
    }

    if (deal.account_id !== +jwt.sub) {
      return {
        status: 403
      };
    }

    return {
      body: deal
    };
  } catch (error) {
    console.error("Can't get deal:", error);
    return {
      status: 500
    };
  }
}
