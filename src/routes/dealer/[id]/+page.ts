import type { Account } from "$lib/database/account/account.model";
import type { Dealer } from "$lib/database/dealer/dealer.model";
import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import { getAllDealerImageUrls, getProfileImage, supabase } from "$lib/supabase";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ params }: LoadEvent) {
  const id = params.id || "";

  navigationStore.currentPage("home");

  const [responseDeals, responsePictures, responseFavoriteDealers, responseAccount, responseProfileImage] =
    await Promise.all([
      supabase.from("deal").select().eq("dealer_id", id),
      getAllDealerImageUrls(id),
      supabase.rpc("get_favorite_dealers"),
      supabase.from("account").select().single(),
      getProfileImage(id, true)
    ]);

  const deals = responseDeals.data;
  const pictures = responsePictures;
  const favoriteDealers = responseFavoriteDealers.data;
  const account: Account = responseAccount.data;
  const profileImage = responseProfileImage;

  if (account && favoriteDealers) {
    return {
      deals,
      pictures,
      dealerId: id,
      account,
      profileImage,
      favoriteDealers: favoriteDealers.map((dealer: Dealer) => dealer.id)
    };
  }

  redirectToLogin();
}
