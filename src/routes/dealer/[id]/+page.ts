import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import dealerService from "$lib/supabase/dealer-service";
import type { Dealer } from "$lib/supabase/public-types";
import StorageService from "$lib/supabase/storage-service";
import { supabase } from "$lib/supabase/supabase-client";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ params }: LoadEvent) {
  const id = params.id || "";

  navigationStore.currentPage("home");

  const [responseDeals, responsePictures, responseFavoriteDealers, responseAccount, responseProfileImage] =
    await Promise.all([
      supabase.from("deals").select().eq("dealer_id", id).eq("template", false),
      StorageService.getAllDealerImageUrls(id),
      supabase.rpc("get_favorite_dealers"),
      dealerService.getDealer(id),
      StorageService.getProfileImage(id, true)
    ]);

  const deals = responseDeals.data;
  const pictures = responsePictures;
  const favoriteDealers = responseFavoriteDealers.data;
  const account = responseAccount;
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
