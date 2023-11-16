import { hasActiveSubscription } from "$lib/supabase/subscription-service";
import { getActiveVouchers } from "$lib/supabase/voucher-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase, userId } = await parent();

  return {
    activeSubscription: hasActiveSubscription(supabase, userId),
    lazy: {
      activeVouchers: getActiveVouchers(supabase, userId)
    }
  };
}
