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

  const [deals, pictures, isFavoriteDealer, account, profileImage] = await Promise.all([
    dealService.getDealsByDealerId(id),
    storageService.getAllDealerImageUrls(id),
    dealerService.isFavoriteDealer(id),
    dealerService.getDealer(id),
    storageService.getProfileImage(id, true)
  ]);

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
