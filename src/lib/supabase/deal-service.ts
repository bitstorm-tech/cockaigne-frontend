import type { DealFilter } from "$lib/database/deal/deal.model";
import dateTimeUtils from "$lib/date-time.utils";
import omit from "lodash/omit";
import locationService from "./location-service";
import type { ActiveDeal, Deal, GetActiveDealsWithinExtentFunctionArguments, HotDeal } from "./public-types";
import { getUserId, supabase } from "./supabase-client";

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

async function getActiveDealsByDealer(dealerIds: string | string[]): Promise<ActiveDeal[]> {
  const ids = Array.isArray(dealerIds) ? dealerIds : [dealerIds];
  const { data, error } = await supabase.from("active_deals_view").select().in("dealer_id", ids);

  if (error) {
    console.error("Can't get active deals:", error);
    return [];
  }

  return data;
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

function createExtentFromFilter(filter: DealFilter): GetActiveDealsWithinExtentFunctionArguments | null {
  if (filter.extent) {
    return { p_extent: filter.extent };
  }

  if (filter.radius && filter.location) {
    return {
      p_location: [filter.location.longitude, filter.location.latitude],
      p_radius: filter.radius
    };
  }

  return null;
}

export async function getDealsByFilter(filter: DealFilter): Promise<ActiveDeal[]> {
  const extent = createExtentFromFilter(filter);

  if (!extent) {
    console.log("Can't get deals by filter -> no valid extent");
    return [];
  }

  let query = supabase.rpc("get_active_deals_within_extent", extent);
  // let query = supabase.from("active_deals_view").select();

  if (filter.categoryIds && filter.categoryIds.length > 0) {
    query = query.in("category_id", filter.categoryIds);
  }

  if (filter.limit) {
    query = query.limit(filter.limit);
  }

  if (filter.order) {
    query = query.order(filter.order.column, { ascending: filter.order.ascending });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Can't get deals by filter:", error);
    return [];
  }

  const hotDeals = await getHotDeals();

  const deals = data.map((deal: ActiveDeal) => {
    deal.isHot = hotDeals.some((hotDeal) => hotDeal.deal_id === deal.id);
    return deal;
  });

  return deals;
}

async function getDealsByDealerId(dealerId: string): Promise<ActiveDeal[]> {
  const { data, error } = await supabase.from("active_deals_view").select().eq("dealer_id", dealerId);

  if (error) {
    console.error("Can't get deals by dealer id:", error);
    return [];
  }

  return data;
}

async function toggleHotDeal(dealId: string): Promise<boolean> {
  const { data } = await supabase.from("hot_deals").select().eq("deal_id", dealId);

  if (data && data.length >= 1) {
    await supabase.from("hot_deals").delete().eq("deal_id", dealId);
    return false;
  }

  const userId = await getUserId();
  if (userId) {
    await supabase.from("hot_deals").insert({ user_id: userId, deal_id: dealId });
  }
  return true;
}

async function getTopDeals(limit: number): Promise<ActiveDeal[]> {
  const filter = await locationService.createFilterByCurrentLocationAndSelectedCategories();
  filter.limit = limit;

  return await getDealsByFilter(filter);
}

async function getHotDeals(): Promise<HotDeal[]> {
  const userId = await getUserId();
  const { error, data } = await supabase.from("hot_deals").select().eq("user_id", userId);

  if (error) {
    console.log("Can't get hot deals:", error);
    return [];
  }

  return data;
}

export default {
  getActiveDealsByDealer,
  getDeal,
  getDealsByDealerId,
  getDealsByFilter,
  getTopDeals,
  toggleHotDeal,
  upsertDeal
};
