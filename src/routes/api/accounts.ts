import type { Account } from "$lib/account.model";
import DbService from "$lib/db.service";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as bcryptjs from "bcryptjs";

export async function post({ request }: RequestEvent) {
  try {
    const accounts = await DbService.getAccountCollection();
    const account: Account = await request.json();
    account.email = account.email.toLowerCase();
    console.debug("Create new account:", account.email);

    const existingAccount = await accounts.findOne({ email: account.email });

    if (existingAccount) {
      console.debug("Account already exists:", account.email);
      return {
        status: 403
      };
    }

    account.password = bcryptjs.hashSync(account.password);
    await accounts.insertOne(account);
    return {
      status: 200
    };
  } catch (error) {
    console.error("Error during post account:", error);
    return {
      status: 500
    };
  }
}
