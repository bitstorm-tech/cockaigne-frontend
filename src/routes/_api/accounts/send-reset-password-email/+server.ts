import { findAccountByEmail, updateAccount } from "$lib/database/account/account.service";
import { errorResponse, response } from "$lib/http.utils";
import { sendResetPasswordMail } from "$lib/mail.utils";
import type { RequestEvent } from "@sveltejs/kit";
import { randomUUID } from "crypto";

export async function POST({ request }: RequestEvent) {
  try {
    const body = await request.json();
    const account = await findAccountByEmail(body.email);

    if (!account) {
      return response();
    }

    const resetPasswordCode = randomUUID();
    await updateAccount(account.id!, { reset_password_code: resetPasswordCode });
    await sendResetPasswordMail(account.username!, account.email, resetPasswordCode);

    return response();
  } catch (error) {
    console.error("Can't send reset password email:", error);
    return errorResponse();
  }
}
