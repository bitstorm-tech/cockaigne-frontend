import { addTimezoneOffsetToDeal, getDateTimeStringWithoutTimezone, getTimeString } from "$lib/date-time.utils";
import { logError } from "$lib/error-utils";
import { createFilterByCurrentLocationAndSelectedCategories } from "$lib/supabase/location-service";
import { getDealImages } from "$lib/supabase/storage-service";
import type { Supabase } from "$lib/supabase/supabase-client";
import omit from "lodash/omit";
import remove from "lodash/remove";
import type {
  ActiveDeal,
  Deal,
  DealFilter,
  DealUpsert,
  GetActiveDealsWithinExtentFunctionArguments
} from "./public-types";

export async function getDeal(supabase: Supabase, id: string): Promise<Deal | undefined> {
  const { data, error } = await supabase.from("deals").select().eq("id", id).single();

  if (error) {
    return logError(error, "Can't get deal");
  }

  const deal: Deal = data;

  if (!deal.imageUrls) {
    deal.imageUrls = [];
  }

  return deal;
}

export async function getTemplates(supabase: Supabase, dealerId: string): Promise<Deal[]> {
  const { data, error } = await supabase.from("deals").select().eq("dealer_id", dealerId).eq("template", true);

  if (error) {
    return logError<Deal[]>(error, "Can't get templates", []);
  }

  return data;
}

export async function getActiveDealsByDealer(supabase: Supabase, dealerIds: string | string[]): Promise<ActiveDeal[]> {
  const ids = Array.isArray(dealerIds) ? dealerIds : [dealerIds];
  const { data, error } = await supabase.from("active_deals_view").select().in("dealer_id", ids);

  if (error) {
    return logError(error, "Can't get active deals", []);
  }

  return enrichDealWithImageUrls(supabase, data);
}

export async function upsertDeal(
  supabase: Supabase,
  deal: Deal,
  alsoCreateTemplate = false
): Promise<string | undefined> {
  addTimezoneOffsetToDeal(deal);
  const _deal = deal.id === "" ? omit(deal, "id") : deal;
  delete _deal.imageUrls;

  const resultUpsertDeal = await supabase.from("deals").upsert(_deal).select("id").single();

  if (resultUpsertDeal.error) {
    return logError(resultUpsertDeal.error, "Can't upsert deal");
  }

  if (!alsoCreateTemplate) {
    return resultUpsertDeal.data.id;
  }

  deal.template = true;
  const resultUpsertTemplate = await supabase.from("deals").insert(deal).select("id").single();

  if (resultUpsertTemplate.error) {
    return logError(resultUpsertTemplate.error, "Can't insert deal template");
  }

  return resultUpsertTemplate.data.id;
}

export async function deleteDeal(supabase: Supabase, dealerId: string, dealId: string): Promise<string | undefined> {
  const { error } = await supabase.from("deals").delete().eq("id", dealId).eq("dealer_id", dealerId);

  if (error) {
    return logError(error, "Can't delete deal", error.message);
  }
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

export async function getDealsByFilter(supabase: Supabase, filter: DealFilter): Promise<ActiveDeal[]> {
  const extent = createExtentFromFilter(filter);

  if (!extent) {
    console.error("Can't get deals by filter -> no valid extent");
    return [];
  }

  let query = supabase.rpc("get_active_deals_within_extent", extent);

  if (filter.categoryIds && filter.categoryIds.length > 0) {
    query = query.in("category_id", filter.categoryIds);
  }

  if (filter.limit) {
    query = query.limit(filter.limit);
  }

  query = query.order("start_time");

  const { data, error } = await query;

  if (error) {
    return logError(error, "Can't get deals by filter", []);
  }

  return enrichDealWithImageUrls(supabase, data);
}

export async function getDealsByDealerId(
  supabase: Supabase,
  dealerId: string,
  activeOnly = true
): Promise<ActiveDeal[] | Deal[]> {
  const query = activeOnly
    ? supabase.from("active_deals_view").select().eq("dealer_id", dealerId)
    : supabase.from("deals").select().eq("dealer_id", dealerId).eq("template", false);
  const { data, error } = await query;

  if (error) {
    return logError(error, "Can't get deals by dealer id", []);
  }

  return enrichDealWithImageUrls(supabase, data);
}

export async function toggleHotDeal(supabase: Supabase, userId: string, dealId: string): Promise<ActiveDeal | null> {
  const { data } = await supabase.from("hot_deals").select().eq("deal_id", dealId);

  if (data && data.length >= 1) {
    await supabase.from("hot_deals").delete().eq("deal_id", dealId);
    return null;
  }

  await supabase.from("hot_deals").insert({ user_id: userId, deal_id: dealId });
  const result = await supabase.from("active_deals_view").select().eq("id", dealId).single();

  if (result.error) {
    return logError(result.error, "Can't get hot deal", null);
  }

  return result.data;
}

export async function getTopDeals(supabase: Supabase, userId: string, limit: number): Promise<ActiveDeal[]> {
  const filter = await createFilterByCurrentLocationAndSelectedCategories(supabase, userId);
  filter.limit = limit;

  return await getDealsByFilter(supabase, filter);
}

export async function getHotDeals(supabase: Supabase, userId: string): Promise<ActiveDeal[]> {
  const hotDealsResult = await supabase.from("hot_deals").select().eq("user_id", userId);

  if (hotDealsResult.error) {
    return logError(hotDealsResult.error, "Can't get hot deals", []);
  }

  const activeDealsResult = await supabase
    .from("active_deals_view")
    .select()
    .in(
      "id",
      hotDealsResult.data.map((hot) => hot.deal_id)
    );

  if (activeDealsResult.error) {
    return logError(activeDealsResult.error, "Can't get hot deals", []);
  }

  return enrichDealWithImageUrls(supabase, activeDealsResult.data);
}

export async function enrichDealWithImageUrls<T extends ActiveDeal[] | Deal[]>(
  supabase: Supabase,
  deals: T
): Promise<T> {
  for (const deal of deals) {
    if (!deal.id || !deal.dealer_id) {
      console.log("Can't enrich deal with image URLs -> either deal or dealer ID unknown");
      continue;
    }
    deal.imageUrls = await getDealImages(supabase, deal.id, deal.dealer_id);
  }

  return deals;
}

export function rotateByCurrentTime(deals: ActiveDeal[]): ActiveDeal[] {
  const nowTime = getTimeString();
  const dealsAfterNow = remove(deals, (deal) => nowTime > getTimeString(deal.start!));

  return [...deals, ...dealsAfterNow];
}

export async function toggleLike(supabase: Supabase, userId: string, deal: ActiveDeal): Promise<number> {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("deal_id", deal.id);

  if (error || !userId || !deal.id) {
    return logError(error, "Can't toggle like", deal.likes || 0);
  }

  const query =
    count === 0
      ? supabase.from("likes").insert({
          user_id: userId,
          deal_id: deal.id
        })
      : supabase.from("likes").delete().eq("user_id", userId).eq("deal_id", deal.id);

  await query;

  if (!deal.likes) {
    deal.likes = 0;
  }

  return count === 0 ? deal.likes + 1 : deal.likes - 1;
}

export function newDeal(): DealUpsert {
  return {
    id: "",
    dealer_id: "",
    start: getDateTimeStringWithoutTimezone(new Date(), 60),
    title: "",
    description: "",
    duration: 24,
    template: false,
    category_id: 1
  };
}
