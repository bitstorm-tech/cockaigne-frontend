import { navigationStore } from "$lib/stores/navigation.store";
import { getDealsByDealerId } from "$lib/supabase/deal-service";
import { getDealer, isFavoriteDealer } from "$lib/supabase/dealer-service";
import { getDealerImages, getProfileImage } from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, parent }: LoadEvent) {
  const id = params.id || "";
  const { session, supabase } = await parent();
  const userId = session?.user.id;

  navigationStore.currentPage("home");

  const [deals, pictures, isFavDealer, account, profileImage] = await Promise.all([
    getDealsByDealerId(supabase, id),
    getDealerImages(supabase, id),
    userId ? isFavoriteDealer(supabase, userId, id) : false,
    getDealer(supabase, id),
    getProfileImage(supabase, id, true)
  ]);

  if (account) {
    return {
      deals,
      pictures,
      dealerId: id,
      account,
      profileImage,
      isFavDealer
    };
  }

  history.back();
}
