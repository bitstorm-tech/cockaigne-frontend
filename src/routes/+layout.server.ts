import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ locals: { getSession } }: ServerLoadEvent) {
  return {
    session: await getSession()
  };
}
