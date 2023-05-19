import type { Session } from "$lib/supabase/supabase-client";
import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ locals: { getSession } }: ServerLoadEvent): Promise<{ session: Session | null }> {
	
console.log("+layout.server.ts");

  return {
    session: await getSession()
  };
}
