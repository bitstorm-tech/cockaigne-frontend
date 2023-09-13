import type { RequestHandler } from "@sveltejs/kit";
import Stripe from "stripe";

const STRIPE_PRIVATE_API_KEY = process.env.STRIPE_PRIVATE_API_KEY || "";
const BASE_URL = process.env.BASE_URL;

const stripe = new Stripe(STRIPE_PRIVATE_API_KEY, {
  apiVersion: "2023-08-16",
  typescript: true
});

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
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
