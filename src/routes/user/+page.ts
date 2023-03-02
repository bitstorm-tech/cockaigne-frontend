import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import accountService from "$lib/supabase/account-service";
import { supabase } from "$lib/supabase/supabase-client";

export const ssr = false;

export async function load() {
  navigationStore.currentPage("home");

  const [accountData, favoriteDealersData, favoriteDealerDealsData] = await Promise.all([
    accountService.getAccount(),
    supabase.rpc("get_favorite_dealers"),
    supabase.rpc("get_favorite_dealer_deals")
  ]);

  const account = accountData;
  account.profileImageUrl = "/images/anonym-profile.png";

  const favoriteDealers = favoriteDealersData.data;
  const favoriteDealerDeals = favoriteDealerDealsData.data;

  if (account) {
    return {
      account,
      favoriteDealers,
      favoriteDealerDeals
    };
  }

  redirectToLogin();
}
