import { errorResponse, response, unauthorizedResponse } from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import { getImageUrls, savePicture } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ url }: RequestEvent) {
  try {
    const dealer = url.searchParams.get("dealer") || -1;
    const pictureUrls = await getImageUrls(+dealer);

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

    return response(pictureUrl, 200, false);
  } catch (error) {
    console.error("Can't post picture:", error);
    return errorResponse();
  }
}
