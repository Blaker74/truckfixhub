# Stripe Integration TODO

## Values to Replace

No placeholder Checkout values remain in the TruckFixHub website integration. The active Supabase `create-panta-checkout` Edge Function uses the existing real Stripe Price ID and TruckFixHub return URLs.

## Configured Parameters

Checkout Session creation is handled server-side by the Supabase Edge Function `create-panta-checkout`.

| Parameter | Value |
|---|---|
| ui_mode | hosted (Stripe SDK v18) |
| mode | payment |
| billing_address_collection | auto |
| phone_number_collection.enabled | false |
| automatic_tax.enabled | false |
| allow_promotion_codes | false |
| submit_type | auto |

`payment_method_collection` is intentionally omitted because this is a one-time `payment` Checkout Session.

## Setup and Next Steps

- `ai-assistant.html` now includes a **Buy Panta Credits** button that calls the authenticated Supabase `create-panta-checkout` Edge Function and redirects the signed-in user to Stripe-hosted Checkout.
- Stripe secret keys remain server-side in Supabase Edge Function secrets; they are not placed in GitHub/browser code.
- The Stripe webhook endpoint is the existing Supabase `panta-stripe-webhook` Edge Function and handles `checkout.session.completed` for Panta credits.
- The webhook associates purchases to the signed-in TruckFixHub user through Checkout metadata and calls the existing `add_panta_credits` database RPC after Stripe reports the Checkout Session as paid.
- Stripe Dashboard webhook destination must continue listening for `checkout.session.completed` and use the signing secret stored as `STRIPE_WEBHOOK_SECRET` in Supabase.
- Before accepting real money, switch Stripe from Sandbox/Test to live resources and ensure the Supabase secrets and Price ID correspond to the live Stripe account/product.
- Stripe test mode can be used with Stripe's documented test card numbers before going live.
- Future work can display the user's current Panta-credit balance and purchase history directly in the website UI.

## Flow Overview

1. User signs into TruckFixHub.
2. User taps **Buy Panta Credits** on `ai-assistant.html`.
3. TruckFixHub sends the user's Supabase access token to `create-panta-checkout`.
4. The Edge Function creates a Stripe-hosted Checkout Session using the configured Panta-credit Price ID.
5. Stripe collects payment.
6. Stripe sends `checkout.session.completed` to `panta-stripe-webhook`.
7. The webhook verifies Stripe's signature and grants credits to the corresponding TruckFixHub user.
8. Stripe returns the customer to the Ask Panta page.

## Project Structure

- `ai-assistant.html` — customer-facing Panta page and checkout launcher.
- Supabase Edge Function `create-panta-checkout` — server-side Stripe Checkout Session creation.
- Supabase Edge Function `panta-stripe-webhook` — signed Stripe webhook fulfillment.
- `STRIPE_INTEGRATION_TODO.md` — single source of truth for Stripe integration status and remaining go-live work.

## Resources

- Stripe Support: https://support.stripe.com
- Stripe MCP documentation: https://docs.stripe.com/mcp
