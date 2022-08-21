import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import { getPictureUrls, savePicture } from "$lib/storage";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ url }: RequestEvent) {
  try {
    const dealer = url.searchParams.get("dealer") || -1;
    const pictureUrls = await getPictureUrls(+dealer);

    return response(pictureUrls);
  } catch (error) {
    console.error("Can't get pictures:", error);
    return errorResponse();
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    const pictureUrl = await savePicture(file, +jwt.sub);

    return response(pictureUrl);
  } catch (error) {
    console.error("Can't post picture:", error);
    return errorResponse();
  }
}
