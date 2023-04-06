import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import accountService from "$lib/supabase/account-service";
import dealerService from "$lib/supabase/dealer-service";
import storageService from "$lib/supabase/storage-service";

export const ssr = false;

export async function load() {
  navigationStore.currentPage("home");

  const [account, favoriteDealers, profileImageUrl] = await Promise.all([
    accountService.getAccount(),
    dealerService.getFavoriteDealers(),
    storageService.getProfileImage()
  ]);

  account.profileImageUrl = profileImageUrl;

  if (account) {
    return {
      account,
      favoriteDealers
    };
  }

  redirectToLogin();
}
