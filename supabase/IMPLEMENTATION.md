# Community implementation plan

## Purpose

TruckFixHub brings drivers, owner-operators, fleet owners, mechanics, and parts people together to solve shared operating problems. The community is the product; the dashboard supports it.

## Service responsibilities

| Service | Intended responsibility | Current status |
| --- | --- | --- |
| GitHub | Source, review, version history, current website hosting | Repository connection verified |
| Supabase | Accounts, PostgreSQL, access policies, media storage, realtime updates | Connection verified; existing schema and policies inspected; authenticated browser acceptance checks pending |
| Resend | Optional notification emails through server-side functions | No connector found; API/domain setup still needed |
| HeyGen | Requested welcome, explainer, and promotional videos | Integration available; no generation started |
| ElevenLabs | Optional spoken content and narration | No connector found; API setup still needed |
| Squarespace | Domain/marketing responsibilities if the owner already uses it | No connector found; current community remains in its existing hosting environment |
| ChatGPT | Development assistance and, if approved later, a clearly identified help feature | No visitor-facing AI feature implemented |

Use server-side secrets for future email, voice, and AI APIs. Never add private API keys or Supabase service-role credentials to public browser files. Introducing a service must have a defined feature and a known cost before enabling paid usage.

## First implementation gate: inspect the existing project

Run `audit-community.sql` through the connected project. It reads configuration only and makes no persistent changes. Confirm the project reference matches the application's existing configuration before running it. Do not commit returned audit results containing policy-specific account identifiers.

Check media table presence, storage bucket existence and limits, uploader ownership rules, parent-post/comment relationships, permitted reader access, moderator permissions, and like uniqueness. Inspect authentication settings through the project dashboard separately; this SQL does not verify email delivery, redirect URLs, or signup protections.

## Acceptance checks for the first working community release

1. A visitor can read intended public posts; creating a post requires sign-in.
2. Member A can create a caption, attach a photo or video, refresh, and find the same attachment. Member B can view it under the intended audience rules.
3. Failed uploads preserve the member's caption and explain what saved, what failed, and how to retry. A successful text post is not mislabeled as a successful media upload.
4. Members can comment, like/unlike once per account, share a stable post link, and report content. Authors and moderators have explicitly defined deletion rights.
5. An unrelated account cannot read or modify another account's private contacts, notes, documents, or flyers. Test policies with separate accounts; UI hiding is insufficient.
6. File limits and content-type checks agree between browser, storage, and database. Refresh, interrupted network, expired links, and account switching produce understandable recovery paths.
7. Verify these flows on iPhone Safari and a desktop browser before promoting the review page to the homepage.

Profiles, following, in-app notifications, and a short-video feed follow a verified storage and permissions foundation. Email notifications require member preferences, unsubscribe handling, and verified sender configuration before delivery is enabled.

## Founding-member work

Blake is the first founding member. Begin with his firsthand industry experiences and questions about attracting the next generation of technicians. No additional founding members are required to begin, and no fictional members or conversations will be created. The owner sends any future invitations; development does not contact people automatically.

## Read-only inspection completed

The project matches the existing site configuration. All 16 inspected public tables have RLS enabled, and the inspected storage buckets are private. Text posts are publicly readable; media access requires authentication. One saved attachment record matched a stored object; this was a metadata consistency check, not a playback test. A synthetic authenticated-role read check returned zero other-member rows across the eight inspected private-tool tables. This does not substitute for separate-account create/read/update/delete testing. No community tables are currently in the realtime publication.

Security advisors flagged leaked-password protection as disabled and several security-definer functions for review. Inspect their intentional public interfaces before changing grants, including the existing call-capture endpoint. No advisor-driven changes were made in this pass. Enable leaked-password protection through the supported Auth configuration before broad onboarding: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
