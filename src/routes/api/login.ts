import DbService from "$lib/db.service";
import { createJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as bcryptjs from "bcryptjs";

export async function post({ request }: RequestEvent) {
  try {
    const body = await request.json();
    const email = body.email.toLowerCase();
    const password = body.password;

    const accounts = await DbService.getAccountCollection();
    const account = await accounts.findOne({ email });
    const isPasswordValid = bcryptjs.compareSync(password, account?.password || "");

    if (!isPasswordValid) {
      return {
        status: 403
      };
    }

    const jwt = await createJwt(account._id.toString());

    return {
      status: 200,
      headers: {
        "set-cookie": [`jwt=${jwt}; SameSite=Lax; Path=/; HttpOnly`]
      },
      body: {
        dealer: account.dealer
      }
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      status: 500
    };
  }
}
