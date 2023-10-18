import { logError } from "$lib/error-utils";
import type { SubscriptionInsert } from "$lib/supabase/public-types";
import type { Supabase } from "$lib/supabase/supabase-client";

export async function createSubscription(
  supabase: Supabase,
  userId: string,
  subscriptionId: string,
  productId: string
): Promise<boolean> {
  const { error: planError, data: planData } = await supabase
    .from("plans")
    .select()
    .eq("stripe_product_id", productId)
    .single();

  if (planError) {
    return logError(planError, "Can't create subscription", false);
  }

  const subscription: SubscriptionInsert = {
    user_id: userId,
    stripe_subscription_id: subscriptionId,
    plan_id: planData.id,
    active: true
  };
  const { error } = await supabase.from("subscriptions").insert(subscription);

  if (error) {
    return logError(error, "Can't create subscription", false);
  }

  return true;
}

export async function hasActiveSubscription(supabase: Supabase, userId: string): Promise<boolean> {
  const { error, count } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("active", true);

  if (error) {
    return logError(error, "Can't check if dealer has active subscriptions", false);
  }

  return (count || 0) > 0;
}
