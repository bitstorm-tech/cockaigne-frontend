import { MONTH_MAPPING } from "$lib/date-time.utils";
import { getInvoiceData } from "$lib/invoices/invoice-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params }: LoadEvent) {
  const date = params["date"];

  if (!date || !date.match(/[0-9]+-[0-9]+/)) {
    return;
  }

  const [year, month] = date.split("-");
  const invoiceData = await getInvoiceData(+year, +month);

  return {
    year,
    monthWord: MONTH_MAPPING[+month],
    invoiceData
  };
}
