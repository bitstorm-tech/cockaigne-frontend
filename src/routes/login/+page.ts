import type { LoadEvent } from "@sveltejs/kit";

export async function load({ parent }: LoadEvent) {
  const { supabase } = await parent();

  return {
    supabase
  };
}
