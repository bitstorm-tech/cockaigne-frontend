import type { DealFilter } from "$lib/database/deal/deal.model";
import { findDealsByFilter } from "$lib/database/deal/deal.service";
import { errorResponse, response } from "$lib/http.utils";
import { getImageUrls } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const filter: DealFilter = await request.json();
    const deals = await findDealsByFilter(filter);

    for (const deal of deals) {
      deal.imageUrls = await getImageUrls(deal.dealer_id, deal.id);
    }

    return response(deals);
  } catch (error) {
    console.error("Can't get filtered deals:", error);
    return errorResponse();
  }
}
