import type { RequestEvent } from "@sveltejs/kit";
import { findAccountById } from "../../../../lib/database/account/account.service";
import { errorResponse, notFoundResponse, response } from "../../../../lib/http.service";

export async function GET({ params }: RequestEvent) {
  const id = params.id || 0;
  try {
    const account = await findAccountById(+id);

    if (!account) {
      console.info("Can't find account with id:", id);
      return notFoundResponse();
    }

    const body = {
      company_name: account.company_name,
      street: account.street,
      house_number: account.house_number,
      zip: account.zip,
      city: account.city
    };

    return response(body);
  } catch (error) {
    console.error("Can't get account with id:", id, error);
    return errorResponse();
  }
}
