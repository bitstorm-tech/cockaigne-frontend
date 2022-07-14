import type { Account } from "$lib/database/account/account.model";
import type { Point } from "$lib/geo/geo.types";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
import { findAccountByEmail, findAccountById, insertAccount } from "../../../lib/database/account/account.service";

export async function get({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      console.warn("Can't get account -> no JWT present");
      return {
        status: 403
      };
    }

    const account = await findAccountById(+jwt.sub);

    if (!account) {
      return {
        status: 404
      };
    }

    account.password = "";

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
    const account: Account = await request.json();
    console.debug("Create new account:", account.email);
    const existingAccount = await findAccountByEmail(account.email);

    if (existingAccount) {
      console.debug("Account already exists:", account.email);
      return {
        status: 403
      };
    }

    const point = {} as Point;
    if (account.dealer) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&street=${account.houseNumber} ${account.street}&city=${account.city}&postalcode=${account.zip}`
      );

      const geoInformation = await response.json();

      if (geoInformation.length === 0) {
        return {
          status: 400
        };
      }

      point.x = geoInformation[0].lon;
      point.y = geoInformation[0].lat;
    }

    account.password = bcryptjs.hashSync(account.password);

    const id = await insertAccount(account, point);
    return {
      status: 200,
      body: id
    };
  } catch (error) {
    console.error("Error during post account:", error);
    return {
      status: 500
    };
  }
}
