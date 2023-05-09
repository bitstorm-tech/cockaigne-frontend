import type { Supabase } from "$lib/supabase/supabase-client";
import type { Dealer, FavoriteDealer } from "./public-types";

export async function getDealer(supabase: Supabase, dealerId: string): Promise<Dealer | null> {
  const { data } = await supabase.from("dealer_view").select().eq("id", dealerId).single();

  if (!data) {
    return null;
  }

  return data;
}

export async function toggleFavoriteDealer(supabase: Supabase, userId: string, dealerId: string) {
  const { data } = await supabase
    .from("favorite_dealers")
    .select("user_id")
    .eq("user_id", userId)
    .eq("dealer_id", dealerId);

  if (data?.length === 0) {
    await supabase.from("favorite_dealers").insert([{ user_id: userId, dealer_id: dealerId }]);
  } else {
    await supabase.from("favorite_dealers").delete().eq("user_id", userId).eq("dealer_id", dealerId);
  }
}

export async function isFavoriteDealer(supabase: Supabase, userId: string, dealerId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorite_dealers")
    .select("dealer_id")
    .eq("user_id", userId)
    .eq("dealer_id", dealerId);

  if (error) {
    console.error("Can't check if dealer is favorite:", error);
    return false;
  }

  return data.length !== 0;
}

export async function getFavoriteDealers(supabase: Supabase, userId: string): Promise<FavoriteDealer[]> {
  const { data } = await supabase.from("favorite_dealers_view").select().eq("user_id", userId);

  if (!data) {
    return [];
  }

  return data;
}
