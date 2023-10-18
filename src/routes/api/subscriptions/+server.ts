import type { RequestHandler } from "@sveltejs/kit";
import Stripe from "stripe";

const STRIPE_PRIVATE_API_KEY = process.env.STRIPE_PRIVATE_API_KEY || "";

const stripe = new Stripe(STRIPE_PRIVATE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true
});

/**
 * This endpoint is called when a dealer subscribes to a plan.
 */
export const POST: RequestHandler = async ({ request, url }) => {
  const formData = await request.formData();
  const lookupKey = formData.get("lookupKey")?.toString() || "";
  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    expand: ["data.product"]
  });

  const host = `${url.protocol}//${url.host}`;
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1
      }
    ],
    mode: "subscription",
    success_url: `${host}/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${host}/plans`
  });

  return new Response(String(session.url));
};

/**
 * This endpoint is called after a subscription was successfully completed to get the
 * subscription data stored at stripe.
 */
export const GET: RequestHandler = async ({ url }) => {
  const sessionId = url.searchParams.get("sessionId") || "";
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const subscriptionId = session.subscription || "";
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const productId = subscription.items.data[0].plan.product;
  const name = subscription.items.data[0].plan.nickname?.replaceAll("-", " ");

  return new Response(String(JSON.stringify({ subscriptionId, productId, name })));
};
