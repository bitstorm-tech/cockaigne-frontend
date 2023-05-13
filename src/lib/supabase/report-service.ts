import { logError } from "$lib/error-utils";
import type { Supabase } from "$lib/supabase/supabase-client";
import type { ReportedDeal } from "./public-types";

export async function getReport(supabase: Supabase, userId: string, dealId: string): Promise<ReportedDeal | null> {
  const { data, error } = await supabase
    .from("reported_deals")
    .select()
    .eq("deal_id", dealId)
    .eq("reporter_id", userId)
    .single();

  if (error) {
    return logError(error, "Can't get report");
  }

  return data;
}

export async function saveReport(supabase: Supabase, userId: string, dealId: string, reason: string) {
  const { error } = await supabase.from("reported_deals").insert({ deal_id: dealId, reason, reporter_id: userId });

  if (error) {
    logError(error, "Can't save report");
  }
}
