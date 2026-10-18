# TruckFixHub Supabase Edge Functions

This directory is the version-controlled home for TruckFixHub Edge Functions.

## Production safety rules

- Never commit API keys, service-role keys, access tokens, passwords, or secret values.
- Runtime credentials must come from Supabase-managed environment variables/secrets.
- GitHub deployment credentials must live only in GitHub Actions secrets.
- Preserve authentication and authorization checks when moving a live function into this repository.
- Do not broaden source allowlists or crawl permissions as part of deployment work.
- Evidence collected by research workers remains quarantined/unverified until the audit and corroboration gates pass.
- Keep retries and external API/model spending bounded.

## Initial migration target

`tfh-government-dispatcher` and its research worker dependencies will be brought under version control before production changes are deployed.

The first confirmed production repair is intentionally narrow: align the dispatcher-to-Fleet-Worker server credential header with the worker's existing authentication contract. Do not disable authentication as a workaround.
