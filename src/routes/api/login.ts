import { createJwt } from "$lib/jwt.service";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";
import * as bcryptjs from "bcryptjs";

export async function post({ request }: RequestEvent) {
  const prisma = new PrismaClient();
  try {
    const body = await request.json();
    const email = body.email.toLowerCase();
    const password = body.password;

    const account = await prisma.account.findFirst({ where: { email } });
    const isPasswordValid = bcryptjs.compareSync(password, account?.password || "");

    if (!account || !isPasswordValid) {
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
