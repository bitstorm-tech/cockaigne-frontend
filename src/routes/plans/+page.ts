import { getActiveVouchers } from "$lib/supabase/voucher-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase, userId } = await parent();

  return {
    lazy: {
      activeVouchers: getActiveVouchers(supabase, userId)
    }
  };
}
