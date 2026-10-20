# Retired Panta Coins / Stripe Experiment

## Status

**Permanently retired from the active TruckFixHub product plan. Do not implement or expose this flow to TruckFixHub users.**

TruckFixHub previously explored selling Panta Coins and connecting paid AI requests to Stripe. That experiment is no longer part of the product architecture.

The current TruckFixHub strategy is:

- Panta is an AI organization and routing concierge.
- Panta structures messy truck complaints into symptoms, supplied evidence, missing information, system classification and a recommended TruckFixHub diagnostic route.
- Verified TruckFixHub content remains the technical foundation.
- Panta must not present invented part numbers, specifications, wiring details, fault definitions or repair procedures as verified information.
- Private AI requests require authenticated TruckFixHub account access.
- No Panta Coins, token balance, paid AI credits, AI checkout or pay-per-question system should be advertised, sold or rebuilt.

## Historical Components

The Supabase project may still contain historical experimental components such as:

- `create-panta-checkout`
- `panta-stripe-webhook`
- older Panta wallet / usage ledger structures
- older AI gateway experiments

Their existence does **not** mean they are approved for customer use. They are historical infrastructure and must not be reconnected to the public website.

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

**Google AdSense is the approved primary strategy for recovering TruckFixHub operating costs.**

Monetization must remain separate from diagnostic conclusions and private repair organization. TruckFixHub should earn traffic by building useful original heavy-duty troubleshooting content, strong topical architecture, trustworthy public resources and a clean user experience. Advertising may support the cost of operating the site, but ads must not determine technical conclusions or interfere with safety-critical information.

Current priorities are:

1. Build substantial original public troubleshooting content and strong diagnostic hubs.
2. Maintain Google-friendly crawl, sitemap, canonical and internal-link architecture.
3. Maintain About, Standards, Privacy, Safety and Contact trust signals.
4. Keep private organizational tools and authenticated repair records out of the public search index.
5. Keep Panta useful as an organizer and router without charging users AI tokens or credits.
6. Use Google AdSense, once approved and appropriate, as the primary cost-recovery channel.

## Repository Rule

This file exists to prevent the retired Stripe/Panta Coins experiment from being accidentally revived during future development. **No future TruckFixHub development should add AI tokens, Panta Coins, paid AI credits, AI checkout or pay-per-question monetization unless the founder explicitly reverses this rule.**

For the active plan, prioritize useful content, verified repair knowledge, Google/SEO quality and AdSense readiness.