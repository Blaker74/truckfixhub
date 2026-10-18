# TruckFixHub 24/7 Knowledge Factory

Issue: #19

## Purpose
TruckFixHub should continue useful knowledge work while the Founder is away without pretending activity equals progress and without allowing raw research to become trusted Panta knowledge.

## Production loop

Heartbeat
→ Mission Control
→ Execution Queue
→ Specialized Worker
→ Evidence Quarantine
→ Audit
→ Corroboration
→ Verified Intelligence
→ Panta retrieval
→ Knowledge-gap detection
→ Targeted mission
→ repeat

## State contract
Every unit of work must have a traceable state. Recommended lifecycle:

`queued → leased → running → review → completed`

Failure paths:

`running → retry_wait → queued`

or, after the bounded retry limit:

`running → blocked`

No worker may silently discard a failed job or retry forever.

## Worker contract
A worker must:

1. Accept only its assigned domain and approved sources.
2. Lease bounded work rather than draining an entire queue.
3. Record attempt, start, completion, and failure state.
4. Store new research as quarantined evidence with `verified=false`.
5. Never promote its own research directly to verified intelligence.
6. Stop retrying after the configured limit.
7. Sleep when no useful work is available.

## Audit contract
Audit must evaluate quarantined evidence before learning/promotion. Audit can reject, request more evidence, or pass evidence forward. Passing audit does not by itself make a factual claim verified.

## Corroboration contract
Candidate claims lacking sufficient independent support generate a targeted corroboration mission. Corroboration must preserve evidence lineage and independent-source counts. Verification standards are not lowered to increase throughput.

## Panta contract
Truck-specific factual answers should prefer verified intelligence. Raw or quarantined evidence may help identify what to research but must not silently become trusted factual knowledge.

When Panta cannot support an important question from verified knowledge, the system should record a bounded knowledge-gap mission rather than invent an answer.

## 24/7 control rules
- Scheduled heartbeat wakes the system.
- Concurrency is bounded by department/worker.
- Retries use limits and backoff.
- Duplicate missions and claims use deterministic keys where practical.
- Research/model spending has hourly and daily ceilings.
- Empty queues cause workers to sleep rather than generate busywork.
- Repeated source/worker failures trigger pause or review.
- Security-sensitive or destructive infrastructure changes remain human-controlled.

## Health dashboard
The government should expose at least:

- queued jobs
- active leases
- oldest lease age
- completions and failures
- retry/blocked counts
- quarantined evidence backlog
- audit backlog
- corroboration backlog
- verified claims promoted
- duplicate work prevented
- model/research cost
- paused workers/sources

## Merit system
Workers are rewarded for useful audited output, not raw activity. Useful measures include accepted evidence, corroborated claims, low failure rate, low duplication, source-policy compliance, and reasonable cost per useful result.

## 24-hour unattended acceptance test
A successful unattended run must demonstrate a traceable chain from scheduled heartbeat through useful worker execution, quarantined evidence, audit, corroboration where required, verified intelligence, Panta retrieval, and new knowledge-gap missions.

The run fails if it produces runaway retries/cost, duplicate loops, secret exposure, source-policy violations, authentication weakening, or automatic promotion of unsupported evidence.
