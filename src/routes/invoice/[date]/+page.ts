import { MONTH_MAPPING } from "$lib/date-time.utils";
import { getInvoiceData } from "$lib/invoices/invoice-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params, parent }: LoadEvent) {
  const { supabase, userId } = await parent();
  const date = params["date"];

  if (!date || !date.match(/[0-9]+-[0-9]+/)) {
    return {
      date
    };
  }

  const [year, month] = date.split("-");
  const invoiceData = await getInvoiceData(supabase, userId, +year, +month);

  return {
    year,
    monthWord: MONTH_MAPPING[+month],
    invoiceData,
    date,
    month
  };
}
