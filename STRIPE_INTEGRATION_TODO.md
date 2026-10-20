# Retired Panta Coins / Stripe Experiment

## Status

**Retired. Do not implement or expose this flow to TruckFixHub users.**

TruckFixHub previously explored selling Panta Coins and connecting paid AI requests to Stripe. That experiment is no longer part of the active product architecture.

The current TruckFixHub strategy is:

- Panta is an AI organization and routing concierge.
- Panta structures messy truck complaints into symptoms, supplied evidence, missing information, system classification and a recommended TruckFixHub diagnostic route.
- Verified TruckFixHub content remains the technical foundation.
- Panta must not present invented part numbers, specifications, wiring details, fault definitions or repair procedures as verified information.
- Private AI requests require authenticated TruckFixHub account access.
- No Panta Coins, token balance, paid AI credits or AI checkout should be advertised or sold.

## Historical Components

The Supabase project may still contain historical experimental components such as:

- `create-panta-checkout`
- `panta-stripe-webhook`
- older Panta wallet / usage ledger structures
- older AI gateway experiments

Their existence does **not** mean they are approved for customer use. Do not reconnect them to the public website unless the product strategy is explicitly changed and the entire payment, fulfillment, reliability, privacy and support flow is reviewed again.

## Active Panta Architecture

The active direction is centered on `tfh-panta-v2` and the authenticated TruckFixHub repair workflow:

1. User describes a truck problem in normal language.
2. Panta organizes the complaint rather than pretending to be an all-knowing mechanic.
3. Panta separates supplied evidence from information that still needs to be gathered.
4. Panta routes the user into an allowlisted TruckFixHub diagnostic hub or catalog.
5. In the private repair workflow, the structured complaint follows the repair record.
6. Confirmed diagnosis, parts used, repair performed and verification remain human/repair-record facts rather than AI assumptions.
7. Completed repairs can eventually support a verified "What Fixed It?" knowledge system.

## Monetization Direction

TruckFixHub monetization should remain separate from unreliable or unverified AI output. Current site-building priorities are architecture, useful original content, Google/SEO quality, AdSense readiness, private organizational tools and verified repair knowledge.

Any future paid feature must be intentionally designed and reviewed before launch. Do not infer approval from this historical file or from dormant backend functions.

## Repository Rule

This file exists only to prevent the retired Stripe/Panta Coins experiment from being accidentally revived during future development. It supersedes the former Panta Coins implementation plan.
