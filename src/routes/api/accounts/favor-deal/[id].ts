import { getAccountsCollection } from "$lib/db.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import { ObjectId } from "mongodb";

export async function post({ request, params }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      console.warn("Can't patch account (toggle favorite deal) -> no JWT present");
      return {
        status: 403
      };
    }

    const dealId = new ObjectId(params.id);
    const accounts = await getAccountsCollection();
    const account = await accounts.findOne({ _id: new ObjectId(jwt.sub), favoriteDeals: dealId });

    if (!account) {
      await accounts.updateOne({ _id: new ObjectId(jwt.sub) }, { $push: { favoriteDeals: dealId } });
    } else {
      await accounts.updateOne({ _id: new ObjectId(jwt.sub) }, { $pull: { favoriteDeals: dealId } });
    }

    return {
      status: 200
    };
  } catch (error) {
    console.error("Error during get account:", error);
    return {
      status: 500
    };
  }
}
