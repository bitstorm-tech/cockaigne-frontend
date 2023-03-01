import type { Dealer } from "./public-types";
import { supabase } from "./supabase-client";

async function getDealer(dealerId: string): Promise<Dealer | null> {
  const { data } = await supabase.from("dealer").select().eq("id", dealerId).single();

  if (!data) {
    return null;
  }

  return data;
}

export default {
  getDealer
};
