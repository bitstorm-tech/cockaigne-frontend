import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      console.warn("Can't patch account (toggle favorite deal) -> no JWT present");
      return unauthorizedResponse();
    }

    // const dealId = new ObjectId(params.id);
    // const accounts = await getAccountsCollection();
    // const account = await accounts.findOne({ _id: new ObjectId(jwt.sub), favoriteDeals: dealId });
    //
    // if (!account) {
    //   await accounts.updateOne({ _id: new ObjectId(jwt.sub) }, { $push: { favoriteDeals: dealId } });
    // } else {
    //   await accounts.updateOne({ _id: new ObjectId(jwt.sub) }, { $pull: { favoriteDeals: dealId } });
    // }
    //
    return response();
  } catch (error) {
    console.error("Error during get account:", error);
    return errorResponse();
  }
}
