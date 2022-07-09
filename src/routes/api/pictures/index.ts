import { extractJwt } from "$lib/jwt.service";
import { savePicture } from "$lib/storage";
import type { RequestEvent } from "@sveltejs/kit";

export async function post({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    await savePicture(file, +jwt.sub);

    return {
      status: 200
    };
  } catch (error) {
    console.error("Can't post picture:", error);
    return {
      status: 500
    };
  }
}
