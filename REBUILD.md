# TruckFixHub community rebuild

## Review entry points

- `dashboard.html`: searchable directory of 26 existing tools, community entry, technician pathway, and the existing Fourthwall gear shop. Favorites store tool URLs on the visitor's device.
- `community.html`: a Supabase-backed social feed with All posts, Photos, and Videos views; sign-in; text/media posting; replies; likes; shared post links; and reports. Videos use native controls without autoplay. New posts require manual refresh; no realtime subscription is claimed.
- `technicians.html`: a starting point for future truck technicians and experienced people willing to share what they know. It does not claim to have verified jobs, apprenticeships, mentors, or placement services.

The existing homepage remains unchanged. These pages are review entry points before a homepage transition, preserving the current tools and account flows. Text conversations are public under the existing database policies; attachments require sign-in. No fake members, posts, activity counts, or endorsements are used.

## Brand and store

Keep the existing TruckFixHub truck logo and `https://truckfixhub-gear-shop.fourthwall.com/`. `assets/brand.mjs` reuses the original embedded artwork directly from the existing homepage, keeping a readable wordmark if loading fails. It stops reading once it finds the logo and caches the public artwork for the browser session when storage is available. The legacy homepage is large, so this is a temporary compatibility measure; a separately hosted original logo remains a performance improvement for a later change. No replacement artwork is introduced.

## Community implementation

Uses the existing public Supabase publishable key and schema. No service-role or private integration keys are included. No schema migrations or member data changes were made during development. The browser uses existing database policies to authorize operations; UI labels do not provide security.

The composer retains stable post and attachment IDs and selected files during retries. Confirmed text posts stay saved if an attachment fails. Metadata is checked before retrying; uncertain metadata responses do not trigger deletion of potentially committed files. The editor can be cleared explicitly; selected files are held in memory, so reloading the page loses unsaved selections. A refresh warning is provided. File limits: four attachments per new post, images up to 10 MB, videos up to 50 MB, using the existing allowed types.

Public posts and replies render as plain text. Signed attachment links expire after 15 minutes; refresh the feed to renew them. Replies show up to the first 100 per post. The current page supports text replies; existing reply attachments remain in the legacy community. Account creation and password reset continue through the existing account page. Author names are member-supplied and do not verify professional credentials.

## Validation

Passed:

- JavaScript syntax checks for all new scripts.
- `node --test tests/community-data.test.mjs`: 11 tests for limits, payloads, deterministic uploads, failed requests, duplicate retries, metadata reconciliation, orphan cleanup, and account switching.
- DOM startup/interaction checks with mock API responses: safe text rendering, signed-out feed, media sign-in gate, signed-in photo filtering, existing like state, unlike, and reply submission.
- Dashboard DOM checks: 26 cards, search, category filters, local favorites, empty states, IDs, private labels, and local destinations.
- Local HTML IDs and links across all three pages.
- Read-only live public posts query returned HTTP 200. The anonymous media join returned HTTP 401, consistent with sign-in-only media access. The actual like-summary RPC signature was checked.

Not yet verified: visual layout in a browser; iPhone Safari; real member signup/sign-in; authenticated photo/video upload and refresh; separate-account access; email delivery; moderation/deletion flows. Mock tests do not establish end-to-end success or comprehensive security. Complete these before promoting the review community to the homepage.

## Next releases

1. Complete browser and two-account acceptance checks and fix observed failures.
2. Add member profiles and role labels, following, moderation tools, and in-app notifications backed by explicit permissions.
3. Expand short-video discovery, accessible captions, and a verified mentor/opportunity workflow.
4. Add consent-based email notifications with server-side Resend configuration. Voice/video services need scoped features and account setup before use.
5. Optimize the legacy homepage assets and plan the entry-point transition without breaking existing tools.

## Color direction

The community, dashboard, and future technician review pages share a Cowboys-inspired palette: navy (#041e42), royal blue (#003594), silver (#869397), pale silver (#dce1e6), and white. TruckFixHub retains its own logo and the existing Fourthwall shop. The shared theme is assets/team-colors.css; it does not apply team logos or change the external store design.

## Public search entry point

Added `trucking-cost-per-mile-calculator.html` with an interactive monthly cost/break-even tool, visible formulas, worked example, self-canonical metadata, and WebPage structured data. Linked it from resources, the existing fuel tool, dashboard and community, and added the public URL to the sitemap. Four arithmetic tests and mock DOM result/error checks passed; canonical URLs, JSON-LD, HTML IDs/links and sitemap XML validated. See SEARCH.md for candidate search intents, deployment and Search Console steps. This is saved for review, not deployed or submitted to search engines.
