import type { Account } from "$lib/database/account/account.model";
import {
  findAccountByEmail,
  findAccountById,
  insertAccount,
  updateAccount
} from "$lib/database/account/account.service";
import type { Position } from "$lib/geo/geo.types";
import {
  errorResponse,
  forbiddenResponse,
  jwtCookieResponse,
  notFoundResponse,
  response,
  unauthorizedResponse
} from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit";
import bcryptjs from "bcryptjs";

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

    const position = {} as Position;
    if (account.dealer) {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&street=${account.houseNumber} ${account.street}&city=${account.city}&postalcode=${account.zip}`
      );

      const geoInformation = await geoResponse.json();

      if (geoInformation.length === 0) {
        console.error(
          "Can't find location for address:",
          account.street,
          account.houseNumber,
          account.zip,
          account.city
        );
        // TODO proper handling
        return response(null, 400);
      }

      position.latitude = geoInformation[0].lat;
      position.longitude = geoInformation[0].lon;
    }

    account.password = bcryptjs.hashSync(account.password);
    account.id = await insertAccount(account, position);

    return await jwtCookieResponse(account);
  } catch (error) {
    console.error("Error during post account:", error);
    return errorResponse();
  }
}

export async function PUT({ request }: RequestEvent) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt || !jwt.sub) {
      return unauthorizedResponse();
    }

    const update = await request.json();
    await updateAccount(+jwt.sub, update);

    return response();
  } catch (error) {
    console.log("Can't patch account:", error);
    return errorResponse();
  }
}
