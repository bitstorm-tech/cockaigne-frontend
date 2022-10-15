import type { DealFilter } from "$lib/database/deal/deal.model";
import { findDealsByFilter } from "$lib/database/deal/deal.service";
import { errorResponse, response } from "$lib/http.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const filter: DealFilter = await request.json();
    const deals = await findDealsByFilter(filter);

    return response(deals);
  } catch (error) {
    console.error("Can't get filtered deals:", error);
    return errorResponse();
  }
}
