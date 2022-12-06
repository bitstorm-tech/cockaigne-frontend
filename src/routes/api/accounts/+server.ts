import type { Account, AccountUpdateOptions } from "$lib/database/account/account.model";
import {
  findAccountByEmail,
  findAccountById,
  insertAccount,
  updateAccount,
  usernameExists
} from "$lib/database/account/account.service";
import type { Position } from "$lib/geo/geo.types";
import {
  errorResponse,
  forbiddenResponse,
  jwtCookieResponse,
  notFoundResponse,
  response,
  unauthorizedResponse,
  usernameAlreadyExistsResponse
} from "$lib/http.service";
import { extractJwt } from "$lib/jwt.service";
import { getProfileImageURL } from "$lib/s3.utils";
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

    account.profile_image = await getProfileImageURL(+jwt.sub);

    delete account.password;

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
      const query = `format=json&street=${account.house_number} ${account.street}&city=${account.city}&postalcode=${account.zip}`;
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?${query}`);
      const geoInformation = await geoResponse.json();

      if (geoInformation.length === 0) {
        console.error(
          "Can't find location for address:",
          account.street,
          account.house_number,
          account.zip,
          account.city
        );
        // TODO proper handling
        return response(null, 400);
      }

      position.latitude = geoInformation[0].lat;
      position.longitude = geoInformation[0].lon;
    }

    if (!account.password) {
      console.warn("Can't create account without password");
      return response(null, 400);
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

    const update: AccountUpdateOptions = await request.json();

    if (update.username && (await usernameExists(update.username))) {
      return usernameAlreadyExistsResponse();
    }

    await updateAccount(+jwt.sub, update);

    return response();
  } catch (error) {
    console.log("Can't patch account:", error);
    return errorResponse();
  }
}
