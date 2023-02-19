import { findAccountByEmail } from "$lib/database/account/account.service";
import { badRequestResponse, errorResponse, forbiddenResponse } from "$lib/http.utils";
import { createJwt } from "$lib/jwt.utils";
import { accountNotActivated } from "$lib/request-errors";
import type { RequestEvent } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";

export async function POST({ request }: RequestEvent) {
  try {
    const body = await request.json();
    const email = body.email.toLowerCase();
    const password = body.password;
    const account = await findAccountByEmail(email);

    if (!account) {
      return forbiddenResponse();
    }

    const isPasswordValid = await bcryptjs.compare(password, account?.password || "");

    if (!account.id || !isPasswordValid) {
      return forbiddenResponse();
    }

    if (account.activation_code) {
      return badRequestResponse(accountNotActivated);
    }

    const jwt = await createJwt(account.id.toString(), { isDealer: account.dealer });

    const headers = new Headers();
    headers.append("set-cookie", `jwt=${jwt}; SameSite=Lax; Path=/; HttpOnly`);
    delete account.password;
    const responseBody = JSON.stringify(account);
    const responseOptions = { headers };

    return new Response(responseBody, responseOptions);
  } catch (error) {
    console.error("Error during login:", error);
    return errorResponse();
  }
}
