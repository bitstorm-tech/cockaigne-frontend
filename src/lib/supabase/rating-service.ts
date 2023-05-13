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
    console.error("Can't save rating:", error);
  }
}
