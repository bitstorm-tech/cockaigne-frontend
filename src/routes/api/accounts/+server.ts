import type { Account } from "$lib/database/account/account.model";
import { findAccountByEmail, findAccountById, insertAccount } from "$lib/database/account/account.service";
import type { Point } from "$lib/geo/geo.types";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";
import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  response,
  unauthorizedResponse
} from "../../../lib/http.service";

export async function GET({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      console.warn("Can't get account -> no JWT present");
      return unauthorizedResponse();
    }

    const account = await findAccountById(+jwt.sub);

    if (!account) {
      return notFoundResponse();
    }

    account.password = "";

    return response(account);
  } catch (error) {
    console.error("Error during get account:", error);
    return errorResponse();
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const account: Account = await request.json();
    console.debug("Create new account:", account.email);
    const existingAccount = await findAccountByEmail(account.email);

    if (existingAccount) {
      console.debug("Account already exists:", account.email);
      return forbiddenResponse();
    }

    const point = {} as Point;
    if (account.dealer) {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&street=${account.houseNumber} ${account.street}&city=${account.city}&postalcode=${account.zip}`
      );

      const geoInformation = await geoResponse.json();

      if (geoInformation.length === 0) {
        // TODO proper handling
        return response(null, 400);
      }

      point.x = geoInformation[0].lon;
      point.y = geoInformation[0].lat;
    }

    account.password = bcryptjs.hashSync(account.password);

    const id = await insertAccount(account, point);
    return response(id);
  } catch (error) {
    console.error("Error during post account:", error);
    return errorResponse();
  }
}
