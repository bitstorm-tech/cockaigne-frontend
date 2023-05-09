import { redirectTo, redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { session, isDealer } = await parent();
  console.log("SESSION:", session);
  // if (user.isAuthenticated) {
  if (session) {
    const user = session.user;
    const route = isDealer ? `/dealer/${user.id}` : "/user";
    return redirectTo(route);
  }

  redirectToLogin();
}
