import { extractJwt } from "$lib/jwt.service";
import { deletePicture } from "$lib/storage";
import type { RequestEvent } from "@sveltejs/kit";

export async function del({ request, params }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const filename = params["filename"];
    await deletePicture(+jwt.sub, filename);

    return {
      status: 200
    };
  } catch (error) {
    console.error("Can't delete picture:", error);
    return {
      status: 500
    };
  }
}
