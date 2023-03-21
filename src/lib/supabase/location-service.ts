import type { DealFilter } from "$lib/database/deal/deal.model";
import { munichPosition, toPostGisPoint, type Position } from "$lib/geo/geo.types";
import { getUserId, supabase } from "./supabase-client";

async function useCurrentLocation(): Promise<boolean> {
  const userId = await getUserId();
  const { error, data } = await supabase.from("accounts").select("use_current_location").eq("id", userId).single();

  if (error) {
    console.log("Can't get useCurrentLocation:", error);
    return false;
  }

  return data.use_current_location || false;
}

async function saveUseCurrentLocation(useCurrentLocation: boolean) {
  const userId = await getUserId();
  await supabase.from("accounts").update({ use_current_location: useCurrentLocation }).eq("id", userId);
}

async function getLocation(): Promise<Position> {
  const userId = await getUserId();
  const { error, data } = await supabase.from("accounts").select("location").eq("id", userId).single();

  if (error) {
    console.log("Can't get location:", error);
    return munichPosition;
  }

  const longitude = data.location.coordinates[0];
  const latitude = data.location.coordinates[1];

  return {
    longitude,
    latitude
  };
}

async function saveLocation(location: Position) {
  const userId = await getUserId();
  const point = toPostGisPoint(location);
  await supabase.from("accounts").update({ location: point }).eq("id", userId);
}

async function createFilterByCurrentLocationAndSelectedCategories(): Promise<DealFilter> {
  const userId = await getUserId();
  const { error, data } = await supabase.from("accounts").select("search_radius, location").eq("id", userId).single();

  if (error) {
    console.log("Can't create filter by current location:", error);
    return {};
  }

  const result2 = await supabase.from("selected_categories").select("category_id").eq("user_id", userId);

  if (result2.error) {
    console.log("Can't create filter by selected categories:", result2.error);
    return {};
  }

  return {
    categoryIds: result2.data.map((result) => result.category_id),
    radius: data.search_radius ?? 500,
    location: {
      longitude: data.location.coordinates[0],
      latitude: data.location.coordinates[1]
    }
  };
}

export default {
  saveUseCurrentLocation,
  useCurrentLocation,
  getLocation,
  saveLocation,
  createFilterByCurrentLocationAndSelectedCategories
};
