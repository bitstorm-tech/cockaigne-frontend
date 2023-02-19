import { findAccountById, findAccountByPasswordResetCode, updateAccount } from "$lib/database/account/account.service";
import { badRequestResponse, errorResponse, response, unauthorizedResponse } from "$lib/http.utils";
import { extractJwt } from "$lib/jwt.utils";
import { sendResetPasswordMail } from "$lib/mail.utils";
import { noAccount, noPasswordResetCode } from "$lib/request-errors";
import type { RequestEvent } from "@sveltejs/kit";
import { randomUUID } from "crypto";
import bcryptjs from "bcryptjs";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const account = await findAccountById(+jwt.sub);

    if (!account) {
      return badRequestResponse(noAccount);
    }

    if (account.reset_password_code) {
      return response();
    }

    const resetPasswordCode = randomUUID();
    await updateAccount(+jwt.sub, { reset_password_code: resetPasswordCode });
    await sendResetPasswordMail(account.username!, account.email, resetPasswordCode);

    return response();
  } catch (error) {
    console.error("Can't send reset password email:", error);
    return errorResponse();
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const body = await request.json();

    const account = await findAccountByPasswordResetCode(body.resetPasswordCode);

    if (!account) {
      return badRequestResponse(noPasswordResetCode);
    }

    const passwordHash = bcryptjs.hashSync(body.password);
    await updateAccount(account.id!, { password: passwordHash, reset_password_code: "" });

    return response();
  } catch (error) {
    console.error("Can't send reset password email:", error);
    return errorResponse();
  }
}
