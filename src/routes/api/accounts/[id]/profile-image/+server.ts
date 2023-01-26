import { findAccountById } from "$lib/database/account/account.service";
import { errorResponse, notFoundResponse, response } from "$lib/http.utils";
import { getProfileImageURL } from "$lib/s3.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params }: RequestEvent) {
  const id = params.id || 0;
  try {
    const account = await findAccountById(+id);

    if (!account) {
      console.info("Can't find account with id:", id);
      return notFoundResponse();
    }

    const profileImageUrl = await getProfileImageURL(+id, account.dealer);

    return response(profileImageUrl);
  } catch (error) {
    console.error("Can't get profile image of account with id:", id, error);
    return errorResponse();
  }
}
