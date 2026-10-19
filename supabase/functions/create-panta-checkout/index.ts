import Stripe from "https://esm.sh/stripe@18?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
const PRICE_ID = "price_1USIdRLm0cU0org4pZbj6oXE";

Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return Response.json({ error: "Sign in required" }, { status: 401, headers: cors });

    const origin = req.headers.get("origin") || "https://truckfixhub.com";
    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted_page",
      mode: "payment",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      submit_type: "auto",
      origin_context: "web",
      success_url: `${origin}/ai-assistant.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ai-assistant.html?payment=cancelled`,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata: { product: "panta_credits" },
    });

    return Response.json({ url: session.url }, { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not start checkout" }, { status: 500, headers: cors });
  }
});
