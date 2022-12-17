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

    const profileImage = await getProfileImageURL(+id, account.dealer);

    const body = {
      company_name: account.company_name,
      street: account.street,
      house_number: account.house_number,
      default_category: account.default_category,
      zip: account.zip,
      city: account.city,
      location: account.location,
      profile_image: profileImage
    };

    return response(body);
  } catch (error) {
    console.error("Can't get account with id:", id, error);
    return errorResponse();
  }
}
