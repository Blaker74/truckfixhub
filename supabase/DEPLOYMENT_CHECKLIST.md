# Supabase Edge Function deployment checklist

Issue: #17

## Before deployment

- [ ] Production Edge Function source has been migrated into `supabase/functions/` without secret values.
- [ ] Authentication behavior is preserved; no JWT or worker authentication is disabled.
- [ ] Research source permissions are unchanged unless separately reviewed.
- [ ] NHTSA source remains approved in the source-policy registry.
- [ ] Fleet Worker explicitly supports the approved NHTSA host before the queued NHTSA mission is released.
- [ ] Research evidence is written as quarantined and unverified.
- [ ] Retry limits and request limits remain bounded.
- [ ] Deployment credentials exist only in the deployment environment, never repository files.

## Dispatcher repair acceptance test

1. Confirm the five-minute heartbeat is succeeding before deployment.
2. Deploy the version-controlled dispatcher through the approved deployment path.
3. Confirm the five-minute heartbeat continues succeeding after deployment.
4. Confirm the dispatcher can hand an approved fleet/recall mission to the Fleet Worker using the worker's existing server-to-server authentication contract.
5. Confirm the queued NHTSA recalls/campaigns job records an execution attempt.
6. Confirm the worker accepts the approved NHTSA host.
7. Confirm returned evidence is stored in quarantine with `verified = false`.
8. Confirm audit runs before any learning/promotion.
9. Confirm corroboration is still required before verified intelligence is produced.
10. Confirm Panta consumes only the verified layer for truck-specific factual claims.

## Rollback conditions

Rollback immediately if:

- heartbeat failures increase,
- authentication unexpectedly becomes permissive,
- a worker can access a non-approved source,
- evidence bypasses quarantine/audit,
- secrets appear in logs or repository history,
- retries loop or external API/model spend becomes unbounded.

## Definition of done

`Heartbeat → Dispatcher → Worker Bee → quarantined evidence → audit → corroboration → verified intelligence` works end-to-end without weakening security or evidence quality gates.
