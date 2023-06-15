import { page } from "$app/stores";
import { logError } from "$lib/error-utils";
import type { Address } from "$lib/geo/address.service";
import type { Deal } from "$lib/supabase/public-types";
import { lastDayOfMonth } from "date-fns";
import { get } from "svelte/store";

export type InvoiceData = {
  invoiceNumber: string;
  address: Address & { name: string };
  deals: Deal[];
};

export async function getInvoiceData(year: number, month: number): Promise<InvoiceData | undefined> {
  const supabase = get(page).data.supabase;
  const userId = get(page).data.userId;

  if (!userId) {
    console.error("Can't get invoice data -> no user ID");
    return;
  }

  const accountResult = await supabase.from("accounts").select().eq("id", userId).single();

  if (accountResult.error) {
    return logError(accountResult.error, "Can't get invoice data -> no account");
  }

  const dateStart = `${year}-${month}-01`;
  const dateEnd = `${year}-${month}-` + lastDayOfMonth(new Date(dateStart)).getDate();

  const dealsResult = await supabase
    .from("deals")
    .select()
    .eq("template", false)
    .gte("start", dateStart)
    .lte("start", dateEnd);

  if (dealsResult.error) {
    return logError(dealsResult.error, "Can't get invoice data -> no deals");
  }

  return {
    invoiceNumber: "1234567890-1234567890-1234567890",
    address: {
      name: accountResult.data.username,
      street: accountResult.data.street || "",
      houseNumber: accountResult.data.house_number || "",
      postcode: accountResult.data.zip || 0,
      city: accountResult.data.city || "",
      country: ""
    },
    deals: dealsResult.data
  };
}
