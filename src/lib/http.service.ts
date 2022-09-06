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
  throw redirect(302, "/login");
}

export function redirectTo(url: string, status = 302) {
  throw redirect(status, url);
}

export async function GET(url: string): Promise<Response> {
  return await fetch(url);
}

export async function PUT(url: string, body: unknown): Promise<Response> {
  return await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export async function POST(url: string, body: unknown): Promise<Response> {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export async function DELETE(url: string, body: unknown): Promise<Response> {
  return await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(body)
  });
}
