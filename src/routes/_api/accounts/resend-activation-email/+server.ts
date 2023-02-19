import { findAccountByEmail, updateAccount } from "$lib/database/account/account.service";
import { badRequestResponse, errorResponse, response } from "$lib/http.utils";
import { sendActivationMail } from "$lib/mail.utils";
import { noAccount } from "$lib/request-errors";
import type { RequestEvent } from "@sveltejs/kit";
import { randomUUID } from "crypto";

export async function POST({ request }: RequestEvent) {
  try {
    const email = await request.text();
    const account = await findAccountByEmail(email);

    if (!account) {
      return badRequestResponse(noAccount);
    }

    const activationCode = randomUUID();
    await updateAccount(account.id!, { activation_code: activationCode });
    await sendActivationMail(account.username!, email, activationCode);

    return response();
  } catch (error) {
    console.error("Can't resend activation code:", error);
    return errorResponse();
  }
}
