import { extractJwt } from "$lib/jwt.utils";
import type { RequestEvent } from "@sveltejs/kit";

export async function load({ request }: RequestEvent) {
  const jwt = await extractJwt(request);
  return {
    user: {
      isAuthenticated: !!jwt,
      isDealer: jwt?.isDealer,
      id: jwt?.sub
    }
  };
}
