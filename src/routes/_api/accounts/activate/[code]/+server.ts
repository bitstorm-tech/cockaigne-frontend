import { activateAccount, findAccountByActivationCode } from "$lib/database/account/account.service";
import { badRequestResponse, errorResponse, response } from "$lib/http.utils";
import { activationFailed } from "$lib/request-errors";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ params }: RequestEvent) {
  try {
    const activationCode = params["code"] || "";
    const account = await findAccountByActivationCode(activationCode);

    if (account && account.id) {
      await activateAccount(account.id);
      return response();
    }

    console.log("Can't activate account, no account with activation code found:", activationCode);
    return badRequestResponse(activationFailed);
  } catch (error) {
    console.error("Can't activate account:", error);
    return errorResponse();
  }
}
