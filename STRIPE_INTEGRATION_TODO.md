# Stripe + Panta Coins Integration

## Customer Offer

TruckFixHub will sell **100 Panta Coins for $5.00** as a one-time purchase. No subscription is required.

Customer-facing language should describe Panta Coins rather than AI tokens. A normal successful paid Panta service costs **5 Panta Coins**. If Panta cannot provide meaningful help because TruckFixHub lacks sufficient verified information, the interaction should cost **0 Panta Coins**. TruckFixHub navigation, account help, and concierge assistance should remain free.

Examples of paid Panta services include useful truck troubleshooting, parts assistance, repair/parts write-ups, personalized sports updates, trip/fuel assistance, and other useful Panta tasks. Free arcade entertainment, if added, must use separate free Play Points and not purchased Panta Coins.

## Cost Protection

The active Panta OpenAI gateway currently uses `gpt-5-mini`, rejects prompts over 8,000 characters, and caps model output at 700 tokens. TruckFixHub already has a `panta_usage_ledger` capable of recording input tokens, output tokens, provider cost, customer charge, and model. Actual provider usage should be recorded so margins can be monitored over time.

## Checkout Configuration

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

## Current Flow

1. User signs into TruckFixHub.
2. User taps the Panta purchase button on `ai-assistant.html`.
3. TruckFixHub sends the user's Supabase access token to `create-panta-checkout`.
4. The Edge Function creates a Stripe-hosted Checkout Session.
5. Stripe collects payment.
6. Stripe sends `checkout.session.completed` to `panta-stripe-webhook`.
7. The webhook verifies Stripe's signature and grants the purchase to the corresponding TruckFixHub user.
8. Stripe returns the customer to Ask Panta.

## Live Go-Live Requirements

Stripe has been moved into Live mode, but the Stripe dashboard showed **Review in progress** on October 19, 2026. Do not describe live payments as fully ready until the following are complete:

- Confirm Stripe account review/activation status.
- Create or identify the **LIVE $5.00 Panta Coins Price** in Stripe. The existing hard-coded Price ID was created before Live activation and must not be assumed to be a live Price.
- Replace the server-side Supabase `STRIPE_SECRET_KEY` with the live Stripe secret key. Never store or commit the secret key in GitHub/browser code.
- Update `create-panta-checkout` to use the verified live $5 Price ID.
- Create/configure the LIVE Stripe webhook destination for `checkout.session.completed` at `https://bncqcdlzmawlmfworalq.supabase.co/functions/v1/panta-stripe-webhook`.
- Store the LIVE webhook signing secret in Supabase as `STRIPE_WEBHOOK_SECRET`. Never commit it to GitHub.
- Change fulfillment so one successful $5 purchase grants exactly **100 Panta Coins**, rather than treating payment cents as the customer-facing coin balance.
- Implement atomic 5-coin charging for successful paid Panta services and 0-coin charging when Panta cannot meaningfully help.
- Expose the signed-in user's Panta Coin balance in the Panta interface.
- Record actual OpenAI token usage/provider cost for margin monitoring.

## Support

TruckFixHub is setting up `support@truckfixhub.com` as the customer support address for payment, missing-coin, login, and account issues. Do not publish the address as operational until the mailbox is verified and working.

## Project Structure

- `ai-assistant.html` — customer-facing Panta page and checkout launcher.
- Supabase `create-panta-checkout` — server-side Stripe Checkout Session creation.
- Supabase `panta-stripe-webhook` — signed Stripe webhook fulfillment.
- Supabase Panta wallet/ledger tables — customer balances, transactions, and provider usage/cost tracking.
- `STRIPE_INTEGRATION_TODO.md` — source of truth for Panta Coins and Stripe go-live status.
