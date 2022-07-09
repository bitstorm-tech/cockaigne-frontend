import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";
import { deleteDealById, findDealById } from "../../../lib/database/deal/deal.service";

export async function get({ params, request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
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
      status: 200,
      body: deal
    };
  } catch (error) {
    console.error("Can't get deal:", error);
    return {
      status: 500
    };
  }
}

export async function del({ params, request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
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

    await deleteDealById(deal.id);

    return {
      status: 200
    };
  } catch (error) {
    console.error("Can't get deal:", error);
    return {
      status: 500
    };
  }
}
