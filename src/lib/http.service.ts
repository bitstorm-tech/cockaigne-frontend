import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { redirect } from "@sveltejs/kit";
import type { Account } from "./database/account/account.model";
import { createJwt } from "./jwt.service";

export function response(bodyData?: unknown, status = 200): Response {
  const body = bodyData ? JSON.stringify(bodyData) : null;
  const options = { status };
  return new Response(body, options);
}

export function unauthorizedResponse(): Response {
  return new Response(null, { status: 401 });
}

export function forbiddenResponse(): Response {
  return new Response(null, { status: 403 });
}

export function notFoundResponse(): Response {
  return new Response(null, { status: 404 });
}

export function errorResponse(text = ""): Response {
  const options = {
    status: 500,
    text
  };

  return new Response(null, options);
}

export async function jwtCookieResponse(account: Account): Promise<Response> {
  if (!account.id) {
    console.error("[http.service.ts] Can't create jwtCookieResponse -> no account ID available");
    return response();
  }

  const jwt = await createJwt(account.id.toString(), { isDealer: account.dealer });
  const headers = new Headers();
  headers.append("set-cookie", `jwt=${jwt}; SameSite=Lax; Path=/; HttpOnly`);

  return new Response(account.id.toString(), { headers });
}

export function redirectToLogin() {
  if (browser) {
    goto("/login").then();
  } else {
    throw redirect(302, "/login");
  }
}

export function redirectTo(url: string, status = 302) {
  if (browser) {
    goto(url).then();
  } else {
    throw redirect(status, url);
  }
}
