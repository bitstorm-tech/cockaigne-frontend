import { createJwt } from "$lib/jwt.service";
import { PrismaClient } from "@prisma/client/scripts/default-index";
import type { RequestEvent } from "@sveltejs/kit";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function post({ request }: RequestEvent) {
  try {
    const body = await request.json();
    const email = body.email.toLowerCase();
    const password = body.password;

    const account = await prisma.account.findUnique({
      where: {
        email
      }
    });
    // const accounts = await getAccountsCollection();
    // const account = await accounts.findOne({ email });
    const isPasswordValid = bcryptjs.compareSync(password, account?.password || "");

    if (!isPasswordValid) {
      return {
        status: 403
      };
    }

    const jwt = await createJwt(account._id.toString(), { isDealer: account.isDealer });

    return {
      status: 200,
      headers: {
        "set-cookie": [`jwt=${jwt}; SameSite=Lax; Path=/; HttpOnly`]
      },
      body: {
        isDealer: account.isDealer,
        id: account._id.toString()
      }
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      status: 500
    };
  }
}
