import { logError } from "$lib/error-utils";
import type { Supabase } from "$lib/supabase/supabase-client";
import type { Rating, RatingUpdate } from "./public-types";

export async function getRatings(supabase: Supabase, dealerId: string): Promise<Rating[]> {
  const { data } = await supabase.from("dealer_ratings_view").select().eq("dealer_id", dealerId);

  if (!data) {
    return [];
  }

  return data;
}

export async function saveRating(supabase: Supabase, rating: RatingUpdate) {
  const { error } = await supabase.from("dealer_ratings").insert(rating);

  if (error) {
    return logError(error, "Can't save dealer rating");
  }
}

export async function updateRating(supabase: Supabase, rating: RatingUpdate) {
  const { error } = await supabase
    .from("dealer_ratings")
    .update(rating)
    .eq("user_id", rating.user_id)
    .eq("dealer_id", rating.dealer_id);

  if (error) {
    return logError(error, "Can't update dealer rating");
  }
}

export async function deleteRating(supabase: Supabase, userId: string, dealerId: string) {
  const { error } = await supabase.from("dealer_ratings").delete().eq("user_id", userId).eq("dealer_id", dealerId);

  if (error) {
    return logError(error, "Can't update dealer rating");
  }
}
