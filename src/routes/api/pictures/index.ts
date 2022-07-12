import { extractJwt } from "$lib/jwt.service";
import { getPictureUrls, savePicture } from "$lib/storage";
import type { RequestEvent } from "@sveltejs/kit";

export async function get({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return {
        status: 403
      };
    }

    const pictureUrls = await getPictureUrls(+jwt.sub);

    return {
      status: 200,
      body: pictureUrls
    };
  } catch (error) {
    console.error("Can't get pictures:", error);
    return {
      status: 500
    };
  }
}
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

    const pictureUrl = await savePicture(file, +jwt.sub);

    return {
      status: 200,
      body: pictureUrl
    };
  } catch (error) {
    console.error("Can't post picture:", error);
    return {
      status: 500
    };
  }
}
