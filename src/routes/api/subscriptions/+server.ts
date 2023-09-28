import type { RequestHandler } from "@sveltejs/kit";
import Stripe from "stripe";

const STRIPE_PRIVATE_API_KEY = process.env.STRIPE_PRIVATE_API_KEY || "";

const stripe = new Stripe(STRIPE_PRIVATE_API_KEY, {
  apiVersion: "2023-08-16",
  typescript: true
});

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
    success_url: `${host}`,
    cancel_url: `${host}/plans`
  });

  return new Response(String(session.url));
};
