import type { LoadEvent } from "@sveltejs/kit";
import { redirectTo, redirectToLogin } from "../lib/http.service";

export async function load({ parent }: LoadEvent) {
  const { user } = await parent();
  if (user.isAuthenticated) {
    const route = user.isDealer ? `/dealer/${user.id}` : `/user/${user.id}`;
    return redirectTo(route);
  }

  redirectToLogin();
}
