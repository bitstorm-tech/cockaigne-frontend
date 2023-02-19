import type { Account } from "$lib/database/account/account.model";
import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import { supabase } from "$lib/supabase/supabase-client";

export const ssr = false;

export async function load() {
  navigationStore.currentPage("home");

  const [accountData, favoriteDealersData, favoriteDealerDealsData] = await Promise.all([
    supabase.from("accounts").select("username").single(),
    supabase.rpc("get_favorite_dealers"),
    supabase.rpc("get_favorite_dealer_deals")
  ]);

  const account: Account = accountData.data as Account;
  account.profile_image = "/images/anonym-profile.png";

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
