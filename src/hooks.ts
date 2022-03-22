import { extractJwt } from "$lib/jwt.service";
import type { RequestEvent } from "@sveltejs/kit/types/private";

export async function handle({ event, resolve }): Promise<Response> {
  event.locals.jwt = await extractJwt(event.request);

  return await resolve(event);
}

export async function getSession(event: RequestEvent) {
  return {
    isAuthenticated: !!event.locals.jwt,
    isDealer: event.locals.jwt?.isDealer
  };
}
