import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function get({ params, request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      return {
        status: 403
      };
    }
    // const deals = await getDealsCollection();
    // const deal = await deals.findOne<Deal>({ _id: new ObjectId(params.id) });
    //
    // if (!deal) {
    //   return {
    //     status: 404
    //   };
    // }
    //
    // if (deal.owner.toString() !== jwt.sub) {
    //   return {
    //     status: 403
    //   };
    // }
    //
    // delete deal.owner;
    // delete deal.likes;
    //
    // return {
    //   body: deal
    // };
  } catch (error) {
    console.error("Can't get deal:", error);
    return {
      status: 500
    };
  }
}
