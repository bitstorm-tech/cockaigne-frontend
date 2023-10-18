import { createSubscription } from "$lib/supabase/subscription-service";
import type { LoadEvent } from "@sveltejs/kit";

export async function load({ url, parent, fetch }: LoadEvent) {
  const { supabase, userId } = await parent();
  const sessionId = url.searchParams.get("sessionId");
  const response = await fetch("/api/subscriptions?sessionId=" + sessionId);
  const body = await response.json();

  createSubscription(supabase, userId, body.subscriptionId, body.productId);

  return {
    subscriptionName: body.name
  };
}
