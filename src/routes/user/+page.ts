import { navigationStore } from "$lib/stores/navigation.store";
import { getAccount } from "$lib/supabase/account-service";
import { getFavoriteDealers } from "$lib/supabase/dealer-service";
import { getProfileImage } from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  navigationStore.currentPage("home");
  const { supabase, session } = await parent();
  const userId = session?.user.id;

  const [account, favoriteDealers, profileImageUrl] = await Promise.all([
    getAccount(supabase, userId),
    getFavoriteDealers(supabase, userId),
    getProfileImage(supabase, userId)
  ]);

  return {
    account,
    favoriteDealers,
    profileImageUrl
  };
}
