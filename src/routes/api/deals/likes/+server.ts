import { findLikedDealsIds } from "$lib/database/like/like.service";
import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const likedDealsIds = await findLikedDealsIds(+jwt.sub);

    return response(likedDealsIds);
  } catch (error) {
    console.error("Can't get likes:", error);
    return errorResponse();
  }
}
