import { redirectToLogin } from "$lib/http.service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const response = await fetch("/api/accounts");

  if (response.ok) {
    const account = await response.json();
    return {
      account
    };
  }

  redirectToLogin();
}
