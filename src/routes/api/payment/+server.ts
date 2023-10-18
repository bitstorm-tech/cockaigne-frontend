import type { RequestHandler } from "@sveltejs/kit";
import Stripe from "stripe";

const STRIPE_PRIVATE_API_KEY = process.env.STRIPE_PRIVATE_API_KEY || "";
const BASE_URL = process.env.BASE_URL;

const stripe = new Stripe(STRIPE_PRIVATE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true
});

/**
 * This endpoint is called when a dealer has to pay for one or more deal days.
 * That happens when a dealer has no subscription and has to pay for every deal individually.
 */
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1NncAKCfn63CcZMYO1Oxcund",
        quantity: body.quantity
      }
    ],
    mode: "payment",
    success_url: `${BASE_URL}/`,
    cancel_url: `${BASE_URL}/`
  });

  return new Response(String(session.url));
};
