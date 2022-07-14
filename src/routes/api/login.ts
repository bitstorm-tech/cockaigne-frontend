import { createJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";
import * as bcryptjs from "bcryptjs";
import { findAccountByEmail } from "../../lib/database/account/account.service";

export async function post({ request }: RequestEvent) {
  try {
    const body = await request.json();
    const email = body.email.toLowerCase();
    const password = body.password;
    const account = await findAccountByEmail(email);

    if (!account) {
      return {
        status: 403
      };
    }

    const isPasswordValid = await bcryptjs.compare(password, account?.password || "");

    if (!account.id || !isPasswordValid) {
      return {
        status: 403
      };
    }

    const jwt = await createJwt(account.id.toString(), { isDealer: account.dealer });

    return {
      status: 200,
      headers: {
        "set-cookie": [`jwt=${jwt}; SameSite=Lax; Path=/; HttpOnly`]
      },
      body: {
        isDealer: account.dealer,
        id: account.id.toString()
      }
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      status: 500
    };
  }
}
