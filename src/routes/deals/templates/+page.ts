import { getUserId, supabase } from "$lib/supabase/supabase-client";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
  const id = await getUserId();
  const { data } = await supabase.from("deals").select().eq("dealer_id", id).eq("template", true);

  if (data) {
    return {
      templates: data
    };
  }
}
