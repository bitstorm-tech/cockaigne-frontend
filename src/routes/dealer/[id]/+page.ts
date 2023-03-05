import { redirectToLogin } from "$lib/http.utils";
import { navigationStore } from "$lib/stores/navigation.store";
import dealService from "$lib/supabase/deal-service";
import dealerService from "$lib/supabase/dealer-service";
import storageService from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export const ssr = false;

export async function load({ params }: LoadEvent) {
  const id = params.id || "";

  navigationStore.currentPage("home");

  const [responseDeals, responsePictures, responseIsFavoriteDealer, responseAccount, responseProfileImage] =
    await Promise.all([
      dealService.getDealsByDealerId(id),
      storageService.getAllDealerImageUrls(id),
      dealerService.isFavoriteDealer(id),
      dealerService.getDealer(id),
      storageService.getProfileImage(id, true)
    ]);

  const deals = responseDeals;
  const pictures = responsePictures;
  const isFavoriteDealer = responseIsFavoriteDealer;
  const account = responseAccount;
  const profileImage = responseProfileImage;

  if (account) {
    return {
      deals,
      pictures,
      dealerId: id,
      account,
      profileImage,
      isFavoriteDealer
    };
  }

  redirectToLogin();
}
