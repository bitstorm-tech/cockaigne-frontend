import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import accountService from "$lib/supabase/account-service";
import dealerService from "$lib/supabase/dealer-service";

export const ssr = false;

export async function load() {
  navigationStore.currentPage("home");

  const [account, favoriteDealersData] = await Promise.all([
    accountService.getAccount(),
    dealerService.getFavoriteDealers()
  ]);

  account.profileImageUrl = "/images/anonym-profile.png";

  const favoriteDealers = favoriteDealersData;

  if (account) {
    return {
      account,
      favoriteDealers
    };
  }

  redirectToLogin();
}
