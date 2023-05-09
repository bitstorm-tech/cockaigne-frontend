import { redirectTo, redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { session } = await parent();

  if (session) {
    const user = session.user;
    const route = user.user_metadata.isDealer ? `/dealer/${user.id}` : "/user";
    return redirectTo(route);
  }

  redirectToLogin();
}
