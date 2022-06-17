import {
  deleteLikeById,
  findLikeByAccountIdAndDealId,
  getLikeCountByDealId,
  insertLike
} from "$lib/database/like/like.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ request, url }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const accountId = +jwt.sub;
    const dealIdString = url.searchParams.get("id");

    if (!dealIdString) {
      console.warn("Can't like/unlike deal without deal id");
      return {
        status: 400
      };
    }

    const dealId = +dealIdString;

    const like = await findLikeByAccountIdAndDealId(accountId, dealId);

    if (like) {
      await deleteLikeById(like.id);
    } else {
      await insertLike(accountId, dealId);
    }

    const likeCount = await getLikeCountByDealId(dealId);

    return {
      status: 200,
      body: likeCount
    };
  } catch (error) {
    console.error("Can't post like:", error);
    return {
      status: 500
    };
  }
}
