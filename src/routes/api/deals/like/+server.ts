import { deleteLike, findLike, getLikeCount, insertLike } from "$lib/database/like/like.service";
import { badRequestResponse, errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import { missingDealId } from "$lib/request-errors";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request, url }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const accountId = +jwt.sub;
    const dealIdString = url.searchParams.get("id");

    if (!dealIdString) {
      console.warn("Can't like/unlike deal without deal id");
      return badRequestResponse(missingDealId);
    }

    const dealId = +dealIdString;

    const like = await findLike(accountId, dealId);

    if (like) {
      await deleteLike(accountId, dealId);
    } else {
      await insertLike(accountId, dealId);
    }

    const likeCount = await getLikeCount(dealId);
    console.log("likeCount:", likeCount);

    return response(likeCount, 200, false);
  } catch (error) {
    console.error("Can't post like:", error);
    return errorResponse();
  }
}
