import { findTemplateDealsByAccountId } from "$lib/database/deal/deal.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function get({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const templateDeals = await findTemplateDealsByAccountId(+jwt.sub);

    return {
      status: 200,
      body: templateDeals
    };
  } catch (error) {
    console.error("Can't get templates:", error);
    return {
      status: 500
    };
  }
}
