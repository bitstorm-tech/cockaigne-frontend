import type { Rating } from "./public-types";
import { supabase } from "./supabase-client";

async function getRatings(dealerId: string): Promise<Rating[]> {
  const { data } = await supabase.from("dealer_ratings_view").select().eq("dealer_id", dealerId);

  if (!data) {
    return [];
  }

  return data;
}

export default {
  getRatings
};
