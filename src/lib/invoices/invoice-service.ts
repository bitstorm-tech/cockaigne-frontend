import { generateDateRange } from "$lib/date-time.utils";
import { logError } from "$lib/error-utils";
import type { Address } from "$lib/geo/address.service";
import type { Deal, InvoiceMetadata } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";
import { lastDayOfMonth } from "date-fns";

export type InvoiceData = {
  invoiceNumber: string;
  address: Address & { name: string };
  deals: Deal[];
};

export type InvoiceOverview = {
  year: number;
  month: number;
  numberOfDeals: number;
  totalAmount: number;
};

export async function getInvoiceData(
  supabase: Supabase,
  userId: string,
  year: number,
  month: number
): Promise<InvoiceData | undefined> {
  if (!userId) {
    console.error("Can't get invoice data -> no user ID");
    return;
  }

  const accountResult = await supabase.from("accounts").select().eq("id", userId).single();

  if (accountResult.error) {
    return logError(accountResult.error, "Can't get invoice data for account");
  }

  const monthString = month > 9 ? month + "" : "0" + month;
  const dateStart = `${year}-${monthString}-01`;
  const dateEnd = `${year}-${monthString}-` + lastDayOfMonth(new Date(dateStart)).getDate();

  const dealsResult = await supabase
    .from("deals")
    .select()
    .eq("dealer_id", userId)
    .eq("template", false)
    .gte("start", dateStart)
    .lte("start", dateEnd);

  if (dealsResult.error) {
    return logError(dealsResult.error, "Can't get invoice data for deals");
  }

  return {
    invoiceNumber: `${userId}-${year}-${monthString}`,
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

export async function getInvoiceOverviews(supabase: Supabase, userId: string): Promise<InvoiceOverview[]> {
  const accountCreationDate = await getAccountCreationDate(supabase, userId);

  if (!accountCreationDate) {
    return logError(undefined, "Can't get invoice overview -> missing account created date", []);
  }

  const invoiceMetadata = await getInvoiceMetadata(supabase, userId);
  const dateRange = generateDateRange(accountCreationDate);

  return dateRange.map((range) => {
    const metadata = invoiceMetadata.find((m) => m.year === range.year && m.month === range.month);
    return {
      year: range.year,
      month: range.month,
      numberOfDeals: metadata?.deals || 0,
      totalAmount: metadata ? ((metadata.total_duration_in_min || 0) / 24) * 4.99 : 0
    };
  });
}

async function getInvoiceMetadata(supabase: Supabase, userId: string): Promise<InvoiceMetadata[]> {
  if (!userId) {
    console.error("Can't get invoice metadata -> no user ID");
    return [];
  }

  const { error, data } = await supabase.from("invoice_metadata_view").select().eq("dealer_id", userId);

  if (error) {
    return logError(error, "Can't get invoice metadata", []);
  }

  return data;
}

async function getAccountCreationDate(supabase: Supabase, userId: string): Promise<Date | undefined> {
  const { error, data } = await supabase.from("accounts").select("created").eq("id", userId).single();

  if (error) {
    return logError(error, "Can't get account created date");
  }

  return new Date(data.created);
}
