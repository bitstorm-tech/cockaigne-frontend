import DbService from "$lib/db.service";
import type { Deal } from "$lib/deal.model";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import { ObjectId } from "mongodb";

export async function post({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      return {
        status: 403
      };
    }

    const deal: Deal = await request.json();
    deal.owner = new ObjectId(jwt.sub);
    const dealCollection = await DbService.getDealCollection();
    await dealCollection.insertOne(deal);
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

export async function get({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      return {
        status: 403
      };
    }

    const dealCollection = await DbService.getDealCollection();
    const cursor = await dealCollection.find({ owner: new ObjectId(jwt.sub) });
    const deals = await cursor.toArray();
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
