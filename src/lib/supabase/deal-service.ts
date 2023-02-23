import type { DealFilter } from "$lib/database/deal/deal.model";
import dateTimeUtils from "$lib/date-time.utils";
import omit from "lodash/omit";
import type { ActiveDeal, Deal } from "./public-types";
import { supabase } from "./supabase-client";

async function getDeal(id: string): Promise<Deal | undefined> {
  const { data, error } = await supabase.from("deals").select().eq("id", id).single();

  if (error) {
    console.error("Can't get deal:", error);
    return;
  }

  const deal: Deal = data;

  if (!deal.imageUrls) {
    deal.imageUrls = [];
  }

  return deal;
}

async function upsertDeal(deal: Deal, alsoCreateTemplate = false): Promise<boolean> {
  dateTimeUtils.addTimezoneOffsetToDeal(deal);
  const _deal = deal.id === "" ? omit(deal, "id") : deal;
  delete _deal.imageUrls;

  let result = await supabase.from("deals").upsert(_deal);

  if (result.error) {
    console.log("Can't upsert deal:", result.error);
    return false;
  }

  if (!alsoCreateTemplate) {
    return true;
  }

  deal.template = true;
  result = await supabase.from("deals").insert(deal);

  if (result.error) {
    console.log("Can't insert deal template:", result.error);
    return false;
  }

  return true;
}

export async function getDealsByFilter(filter: DealFilter): Promise<ActiveDeal[]> {
  const { data, error } = await supabase.from("active_deals").select();

  if (error) {
    console.error("Can't get filtered deals:", error);
    return [];
  }

  return data;
}

export default {
  getDeal,
  upsertDeal,
  getDealsByFilter
};
