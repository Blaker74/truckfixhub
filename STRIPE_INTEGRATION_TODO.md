# Stripe Integration TODO

## Values to Replace

The checkout uses the real Stripe test-mode Panta Credits Price ID. There are no sample `price_...` placeholders in the Checkout Session call.

**Files containing Checkout values:**
- [supabase/functions/create-panta-checkout/index.ts](supabase/functions/create-panta-checkout/index.ts)

| Field | Current Value | What to Set |
|---|---|---|
| mode | payment | Correct for the one-time $5 Panta Credits purchase. |
| success_url | `${origin}/ai-assistant.html?payment=success&session_id={CHECKOUT_SESSION_ID}` | Keep for TruckFixHub unless the success destination changes. |
| cancel_url | `${origin}/ai-assistant.html?payment=cancelled` | Keep for TruckFixHub unless the return destination changes. |
| line_items[].price | `price_1USIdRLm0cU0org4pZbj6oXE` | Current Stripe **Sandbox/test-mode** $5 Panta Credits Price ID. Replace with the live-mode Price ID before accepting real money. |

## Configured Parameters

**Files containing these parameters:**
- [supabase/functions/create-panta-checkout/index.ts](supabase/functions/create-panta-checkout/index.ts)

| Parameter | Value |
|---|---|
| ui_mode | hosted_page |
| billing_address_collection | auto |
| phone_number_collection | `{ enabled: false }` |
| automatic_tax | `{ enabled: false }` |
| allow_promotion_codes | false |
| submit_type | auto |
| origin_context | web |

`payment_method_collection` is intentionally omitted because this is a one-time `payment`, not a subscription.

## Setup and Next Steps

1. In Supabase Edge Function secrets, set `STRIPE_SECRET_KEY` to the matching Stripe **test secret key** while testing. Never put the secret key in browser code or GitHub.
2. Deploy `supabase/functions/create-panta-checkout/index.ts` as the `create-panta-checkout` Edge Function.
3. Add the TruckFixHub buy-credit button/client call to POST to that function, then redirect the browser to the returned `url`.
4. Test in Stripe Sandbox. Stripe's standard successful test card is `4242 4242 4242 4242`, with any future expiration date and any valid CVC/postal value accepted by test mode.
5. Before launch, complete Stripe business verification, create/copy the Panta Credits product into **live mode**, replace the test `price_...` with its live Price ID, and switch `STRIPE_SECRET_KEY` to the live secret.
6. A successful payment does **not yet grant or decrement Panta credits**. Add verified fulfillment (normally a Stripe webhook for `checkout.session.completed`) and store each signed-in user's credit balance in Supabase before charging real customers.
7. After fulfillment exists, make the Panta bridge check/decrement the user's stored balance for paid AI usage.

### New project structure

- `supabase/functions/create-panta-checkout/index.ts` — server-side Hosted Stripe Checkout Session creation.
- `STRIPE_INTEGRATION_TODO.md` — single source of truth for remaining Stripe work.

### Flow

Signed-in TruckFixHub user → Buy Panta Credits → Supabase Edge Function → Stripe Hosted Checkout → $5 one-time payment → return to Ask Panta. Credit fulfillment still must be implemented before live sales.

### Resources

- Stripe Support: https://support.stripe.com
- Stripe MCP docs: https://docs.stripe.com/mcp
