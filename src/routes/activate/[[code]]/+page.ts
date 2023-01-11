import { goto } from "$app/navigation";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ params }: LoadEvent) {
  const activationCode = params["code"];

  if (activationCode) {
    const response = await fetch("/api/accounts/activate/" + activationCode);
    if (response.ok) {
      await goto("/");
    }

    return {
      activationFailed: true
    };
  }

  return {
    noActivationCode: true
  };
}
