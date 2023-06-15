import { generateDateRange } from "$lib/date-time.utils";
import { getAccount } from "$lib/supabase/account-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase, userId } = await parent();
  const account = await getAccount(supabase, userId);

  if (!account) {
    return {
      invoiceDates: []
    };
  }

  const invoiceDates = generateDateRange(new Date(account.created));
  return { invoiceDates };
}
