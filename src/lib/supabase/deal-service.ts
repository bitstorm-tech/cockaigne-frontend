import type { Deal } from "./public-types";
import { supabase } from "./supabase-client";

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

export default {
  getDeal
};
