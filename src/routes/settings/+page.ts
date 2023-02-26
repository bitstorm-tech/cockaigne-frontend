import { goto } from "$app/navigation";
import accountService from "$lib/supabase/account-service";

export const ssr = false;

export async function load() {
  const account = accountService.getAccount();

  if (!account) {
    goto("/");
  }

  return {
    account
  };
}
