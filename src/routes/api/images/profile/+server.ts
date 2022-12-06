import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import { saveProfilePicture } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    const pictureUrl = await saveProfilePicture(file, +jwt.sub);

    return response(pictureUrl, 200, false);
  } catch (error) {
    console.error("Can't post profile picture:", error);
    return errorResponse();
  }
}
