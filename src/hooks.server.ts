import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	console.log("hooks.server.ts #1");
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_API_KEY,
		event
	});

	console.log("hooks.server.ts #2");
  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  console.log("hooks.server.ts #3");

  return resolve(event);
};
