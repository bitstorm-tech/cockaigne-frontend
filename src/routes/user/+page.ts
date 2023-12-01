import { navigationStore } from "$lib/stores/navigation.store";
import { getAccount } from "$lib/supabase/account-service";
import { getCategories } from "$lib/supabase/category-service";
import { getFavoriteDealers } from "$lib/supabase/dealer-service";
import { getProfileImage } from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  navigationStore.currentPage("home");
  const { supabase, userId } = await parent();

  const [profileImageUrl, categories, account, favoriteDealers] = await Promise.all(
    userId
      ? [
          getProfileImage(supabase, userId),
          getCategories(supabase),
          getAccount(supabase, userId),
          getFavoriteDealers(supabase, userId)
        ]
      : [getProfileImage(supabase, userId), getCategories(supabase)]
  );

  return {
    account,
    categories,
    favoriteDealers,
    profileImageUrl
  };
}
