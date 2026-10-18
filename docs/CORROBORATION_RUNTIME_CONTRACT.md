# Automatic Corroboration Runtime Contract

Issue: #19

## Production fact driving this work
The live research pipeline currently has candidate claims with one independent source and no corroboration work items. The schema already supports `corroborate` work, `needs_corroboration` handoffs, independent-source counts, claim/evidence lineage, audit states, and a final verified-intelligence store.

The missing behavior is therefore orchestration, not another database layer.

## Required transition

`candidate claim with insufficient independent support`
→ `needs_corroboration handoff`
→ `corroborate work item`
→ `approved independent source research`
→ `quarantined evidence (verified=false)`
→ `audit`
→ `claim/evidence link`
→ `rescore independent source count`
→ `verified promotion only if threshold and quality rules pass`

## Idempotency
Mission Control must not create duplicate corroboration work every heartbeat.

A deterministic corroboration key should be derived from the claim identity and corroboration purpose. Before creating work, the controller must detect an already queued/working/review corroboration assignment for that claim.

Completed corroboration may be re-opened only when the claim is stale, conflicting evidence appears, or an explicit recheck is due.

## Eligibility
A claim is eligible for automatic corroboration when all are true:

- status is `candidate` or `corroborating`
- independent trustworthy source count is below the configured verification threshold
- the claim has at least one audited supporting evidence record
- there is no active corroboration assignment for the same claim
- an approved source path exists or a source-discovery review can be created
- system health and cost budget allow new work

## Source independence
Corroboration must add genuinely independent support. Multiple pages from the same publisher/authority must not be counted as multiple independent sources merely because the URLs differ.

Source-policy rules remain authoritative. A corroboration need does not grant permission to crawl a disabled, private, login-only, terms-restricted, or otherwise unapproved source.

## Worker output
A corroboration worker may produce evidence but may not verify the claim. New evidence enters quarantine with `verified=false` and retains:

- claim/work relationship
- source identity and publisher/host
- retrieval timestamp
- evidence excerpt/hash as applicable
- worker/execution lineage
- audit state

## Auditor output
Audit determines whether the new evidence is acceptable, independent, relevant, fresh enough, and actually supports or contradicts the claim.

Audit pass is not verification. Accepted evidence is linked to the claim and the claim is rescored.

## Promotion gate
A claim may enter verified intelligence only when the configured independent-source threshold and all quality/audit rules pass. Promotion must preserve claim-to-evidence lineage.

If evidence conflicts, the claim must move to a conflict/review path rather than being promoted by majority count alone.

## Backpressure and cost
Corroboration has priority over speculative collection because it converts existing research into potentially usable verified knowledge.

The controller must still honor bounded concurrency, retries, backoff, source rate limits, and daily/hourly spend ceilings.

## Failure behavior
- no approved independent source available → create/retain source-review or source-discovery work; do not broaden permissions automatically
- worker failure → bounded retry/backoff
- retry exhausted → blocked/dead-letter review
- audit rejection → retain lineage and rejection reason; claim remains unverified
- conflicting evidence → conflict/review path
- security/policy issue → pause affected path and surface Founder review

## Acceptance test
The first successful production proof should show one existing one-source candidate claim moving through:

1. automatic corroboration assignment
2. approved independent-source evidence collection
3. quarantine with `verified=false`
4. audit
5. evidence linkage and source-count rescore
6. qualifying verified promotion OR an explicit evidence-based rejection/conflict result

A fabricated second source, manually incremented source count, or direct candidate→verified update is a failed test.
