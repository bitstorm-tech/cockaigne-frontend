import type { Deal } from "$lib/database/deal/deal.model";
import { findAllDeals, upsertDeal } from "$lib/database/deal/deal.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const deal: Deal = await request.json();
    deal.account_id = +jwt.sub;
    deal.start = new Date(deal.start);

    await upsertDeal(deal);

    return {
      status: 200
    };
  } catch (error) {
    console.error("Can't post deal:", error);
    return {
      status: 500
    };
  }
}

export async function get({ request, url }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);
    const allDeals = url.searchParams.get("all");

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const deals = await findAllDeals();

    return {
      body: deals
    };
  } catch (error) {
    console.error("Can't get deals:", error);
    return {
      status: 500
    };
  }
}
