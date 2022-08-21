import { browser } from "$app/env";
import { goto } from "$app/navigation";
import { redirect } from "@sveltejs/kit";

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

export function redirectToLogin() {
  if (browser) {
    goto("/login").then();
  } else {
    throw redirect(302, "/login");
  }
}

export function redirectTo(url: string, status = 302) {
  if (browser) {
    console.log("GOTO:", url);
    goto(url).then();
  } else {
    throw redirect(status, url);
  }
}
