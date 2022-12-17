import { redirectTo, redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { user } = await parent();
  if (user.isAuthenticated) {
    const route = user.isDealer ? `/dealer/${user.id}` : "/user";
    return redirectTo(route);
  }

  redirectToLogin();
}
