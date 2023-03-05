import type { Dealer, FavoriteDealer } from "./public-types";
import { getUserId, supabase } from "./supabase-client";

async function getDealer(dealerId: string): Promise<Dealer | null> {
  const { data } = await supabase.from("dealer_view").select().eq("id", dealerId).single();

  if (!data) {
    return null;
  }

  return data;
}

async function toggleFavoriteDealer(dealerId: string) {
  const userId = await getUserId();

  if (!userId) return;

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

async function getFavoriteDealerIDs(): Promise<string[]> {
  const userId = await getUserId();

  if (!userId) return [];

  const { data } = await supabase.from("favorite_dealers").select("dealer_id").eq("user_id", userId);

  if (!data) {
    return [];
  }

  return data.map((favoriteDealer) => favoriteDealer.dealer_id);
}

async function getFavoriteDealers(): Promise<FavoriteDealer[]> {
  const userId = await getUserId();

  if (!userId) return [];

  const { data } = await supabase.from("favorite_dealers_view").select().eq("user_id", userId);

  if (!data) {
    return [];
  }

  return data;
}

export default {
  getDealer,
  toggleFavoriteDealer,
  getFavoriteDealerIDs,
  getFavoriteDealers
};
