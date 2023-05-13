import { getTemplates } from "$lib/supabase/deal-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase, session } = await parent();
  const templates = getTemplates(supabase, session.user.id);

  return {
    templates
  };
}
