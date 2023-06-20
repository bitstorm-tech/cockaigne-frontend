import { getInvoiceOverviews } from "$lib/invoices/invoice-service";

import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase, userId } = await parent();

  if (!userId) {
    return {
      invoiceDates: []
    };
  }

  const invoiceOverviews = await getInvoiceOverviews(supabase, userId);

  return {
    invoiceOverviews
  };
}
