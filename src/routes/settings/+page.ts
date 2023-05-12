import { goto } from "$app/navigation";
import { getAccount } from "$lib/supabase/account-service";
import { getProfileImage } from "$lib/supabase/storage-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase, session } = await parent();
  const userId = session.user.id;
  const account = await getAccount(supabase, userId);

  if (!account) {
    return goto("/");
  }

  account.profileImageUrl = await getProfileImage(supabase, account.id, account.is_dealer);

  return {
    account
  };
}
