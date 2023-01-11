import type { RequestError } from "$lib/request-errors";
import { redirect } from "@sveltejs/kit";
import type { Account } from "./database/account/account.model";
import { createJwt } from "./jwt.utils";

export function response(bodyData?: unknown, status = 200, stringify = true): Response {
  const body = bodyData ? (stringify ? JSON.stringify(bodyData) : bodyData.toString()) : null;
  const options = { status };
  return new Response(body, options);
}

export function badRequestResponse(error: RequestError): Response {
  return new Response(JSON.stringify(error), { status: 400 });
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
  throw redirect(302, "/login");
}

export function redirectTo(url: string) {
  throw redirect(302, url);
}

export function PUT(body: unknown) {
  return {
    method: "PUT",
    body: JSON.stringify(body)
  };
}

export function POST(body: unknown) {
  return {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body)
  };
}

export function DELETE(body: unknown) {
  return {
    method: "DELETE",
    body: JSON.stringify(body)
  };
}