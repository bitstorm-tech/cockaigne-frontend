import { goto } from "$app/navigation";
import accountService from "$lib/supabase/account-service";
import storageService from "$lib/supabase/storage-service";

export const ssr = false;

export async function load() {
  const account = await accountService.getAccount();

  if (!account) {
    return goto("/");
  }

  account.profileImageUrl = await storageService.getProfileImage(account.id, account.dealer);

  return {
    account
  };
}
