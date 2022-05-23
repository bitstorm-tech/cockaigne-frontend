import PrismaClient from "$lib/database/prisma";
import { extractJwt } from "$lib/jwt.service";
import type { Deal } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function post({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      return {
        status: 403
      };
    }

    // const deal: Deal = await request.json();
    // deal.owner = new ObjectId(jwt.sub);
    // deal.startDate = deal.startDate.substring(0, 16);
    // const deals = await getDealsCollection();
    // if (deal._id) {
    //   const _id = new ObjectId(deal._id);
    //   delete deal._id;
    //   await deals.updateOne({ _id }, { $set: deal });
    // } else {
    //   await deals.insertOne(deal);
    // }

    const deal: Deal = await request.json();
    deal.accountId = +jwt.sub;
    deal.start = new Date(deal.start);

    await prisma.deal.upsert({
      create: deal,
      update: deal,
      where: { id: deal.id || -1 }
    });

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

    if (!jwt) {
      return {
        status: 403
      };
    }

    // const dealCollection = await getDealsCollection();
    // const filter = allDeals ? undefined : { owner: new ObjectId(jwt.sub) };
    // const cursor = await dealCollection.find(filter);
    // const deals = await cursor.toArray();
    // deals.forEach((deal) => {
    //   if (Array.isArray(deal.likes)) {
    //     deal.likes = deal.likes.length;
    //   } else {
    //     deal.likes = 0;
    //   }
    // });

    const deals = await prisma.deal.findMany();

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
