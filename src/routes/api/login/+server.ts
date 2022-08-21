import type { RequestEvent } from "@sveltejs/kit";
import * as bcryptjs from "bcryptjs";
import { findAccountByEmail } from "../../../lib/database/account/account.service";
import { errorResponse, forbiddenResponse } from "../../../lib/http.service";
import { createJwt } from "../../../lib/jwt.service";

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

    const jwt = await createJwt(account.id.toString(), { isDealer: account.dealer });

    const headers = new Headers();
    headers.append("set-cookie", `jwt=${jwt}; SameSite=Lax; Path=/; HttpOnly`);
    const responseBody = JSON.stringify({ isDealer: account.dealer, id: account.id.toString() });
    const responseOptions = { headers };

    return new Response(responseBody, responseOptions);
  } catch (error) {
    console.error("Error during login:", error);
    return errorResponse();
  }
}
