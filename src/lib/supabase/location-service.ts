import { logError } from "$lib/error-utils";
import { munichPosition, toPostGisPoint, type Position } from "$lib/geo/geo.types";
import type { DealFilter, Location } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";

export async function getUseCurrentLocation(supabase: Supabase, userId: string): Promise<boolean> {
  const { error, data } = await supabase.from("accounts").select("use_current_location").eq("id", userId).single();

  if (error) {
    return logError(error, "Can't get useCurrentLocation", false);
  }

  return data.use_current_location || false;
}

export async function saveUseCurrentLocation(supabase: Supabase, userId: string, useCurrentLocation: boolean) {
  const { error } = await supabase
    .from("accounts")
    .update({ use_current_location: useCurrentLocation })
    .eq("id", userId);

  if (error) {
    logError(error, "Can't save useCurrentLocation");
  }
}

export async function getLocation(supabase: Supabase, userId: string): Promise<Position> {
  const { error, data } = await supabase.from("accounts").select("location").eq("id", userId).single();

  if (error || !data.location) {
    return logError(error, "Can't get location", munichPosition);
  }

  const longitude = (data.location as Location).coordinates[0];
  const latitude = (data.location as Location).coordinates[1];

  return {
    longitude,
    latitude
  };
}

export async function saveLocation(supabase: Supabase, userId: string, location: Position) {
  const point = toPostGisPoint(location);
  await supabase.from("accounts").update({ location: point }).eq("id", userId);
}

export async function createFilterByCurrentLocationAndSelectedCategories(
  supabase: Supabase,
  userId: string
): Promise<DealFilter> {
  const { error, data } = await supabase.from("accounts").select("search_radius, location").eq("id", userId).single();

  if (error) {
    return logError(error, "Can't create filter by current location", {});
  }

  const result2 = await supabase.from("selected_categories").select("category_id").eq("user_id", userId);

  if (result2.error) {
    return logError(error, "Can't create filter by selected categories", {});
  }

  return {
    categoryIds: result2.data.map((result) => result.category_id),
    radius: data.search_radius! / 2 ?? 250,
    location: {
      longitude: (data.location as Location).coordinates[0],
      latitude: (data.location as Location).coordinates[1]
    }
  };
}

export async function getSearchRadius(supabase: Supabase, userId: string): Promise<number> {
  const { error, data } = await supabase.from("accounts").select("search_radius").eq("id", userId).single();

  if (error) {
    return logError(error, "Can't get search radius", 500);
  }

  return data.search_radius;
}

export async function saveSearchRadius(supabase: Supabase, userId: string, searchRadius: number) {
  await supabase.from("accounts").update({ search_radius: searchRadius }).eq("id", userId);
}
