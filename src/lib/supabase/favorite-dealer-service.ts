import { getUserId, supabase } from "./supabase-client";

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

export default {
  toggleFavoriteDealer,
  getFavoriteDealerIDs
};
