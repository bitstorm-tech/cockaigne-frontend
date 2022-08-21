import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import { deletePicture } from "$lib/storage";
import type { RequestEvent } from "@sveltejs/kit";

export async function DELETE({ request, params }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    await deletePicture(+jwt.sub, params.filename || "");

    return response();
  } catch (error) {
    console.error("Can't delete picture:", error);
    return errorResponse();
  }
}
