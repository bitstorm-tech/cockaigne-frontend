import PrismaClient from "$lib/database/prisma";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";

const prisma = new PrismaClient();

export async function get({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      console.warn("Can't get account -> no JWT present");
      return {
        status: 403
      };
    }

    const account = await prisma.account.findUnique({
      where: { id: +jwt.sub },
      include: { favorites: true }
    });

    if (!account) {
      return {
        status: 404
      };
    }

    delete account.password;

    return {
      status: 200,
      body: account
    };
  } catch (error) {
    console.error("Error during get account:", error);
    return {
      status: 500
    };
  }
}

export async function post({ request }: RequestEvent) {
  try {
    // const accounts = await getAccountsCollection();
    // const account: Account = await request.json();
    // account.email = account.email.toLowerCase();
    // console.debug("Create new account:", account.email);
    //
    // const existingAccount = await accounts.findOne({ email: account.email });
    //
    // if (existingAccount) {
    //   console.debug("Account already exists:", account.email);
    //   return {
    //     status: 403
    //   };
    // }
    //
    // account.password = bcryptjs.hashSync(account.password);
    // await accounts.insertOne(account);
    // return {
    //   status: 200
    // };
  } catch (error) {
    console.error("Error during post account:", error);
    return {
      status: 500
    };
  }
}
