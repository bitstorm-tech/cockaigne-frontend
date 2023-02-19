import { errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.utils";
import { saveProfilePicture } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const { base64 } = await request.json();
    const pictureUrl = await saveProfilePicture(base64, +jwt.sub);

    return response(pictureUrl, 200, false);
  } catch (error) {
    console.error("Can't post profile picture:", error);
    return errorResponse();
  }
}
