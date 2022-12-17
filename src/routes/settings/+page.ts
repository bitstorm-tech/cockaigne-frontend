import { redirectToLogin } from "$lib/http.utils";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

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
