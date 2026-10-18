# 24/7 Knowledge Factory — Health & Scaling Contract

Issue: #19

This document turns “keep working 24/7” into measurable operating rules. It does not grant new production permissions or deploy code.

## Core principle
Scale throughput only when the downstream stages can keep up. More Worker Bees are useful only when evidence can still be audited and corroborated without creating an uncontrolled backlog.

## Pipeline health states

### GREEN — healthy
- heartbeat is current
- leases are completing or failing cleanly
- no unbounded retry loops
- evidence remains quarantined until audit
- audit backlog is within its operating window
- corroboration backlog is within its operating window
- verified promotions preserve evidence lineage
- cost remains inside configured budget

Action: continue normal bounded dispatch.

### YELLOW — constrained
Any of these should constrain new collection:
- audit backlog grows faster than it clears
- corroboration backlog grows faster than it clears
- repeated source failures
- repeated worker failures
- stale leases appear
- duplicate-work rate rises
- spend approaches its configured ceiling

Action: reduce collection concurrency, prioritize clearing downstream work, and create no speculative busywork.

### RED — stop/pause
Any of these should stop the affected worker/source/path:
- authentication unexpectedly weakens or fails repeatedly
- source-policy violation
- evidence bypasses quarantine
- unsupported claims are promoted
- secret exposure is suspected
- retry loop exceeds configured limit
- cost ceiling is reached
- destructive/security-sensitive action would require human approval

Action: pause the affected path, preserve diagnostic evidence, and surface a Founder review item.

## Backpressure
Mission Control should not continuously create collection work when downstream queues are saturated.

Recommended control order:
1. clear expired/stale leases
2. process already-collected evidence
3. clear audit backlog
4. clear corroboration backlog
5. promote only qualifying verified intelligence
6. dispatch new collection work only when capacity remains

## Worker scaling
Worker concurrency is a configuration value, not an unlimited loop.

Increase a worker pool only when:
- its queue has useful approved work
- its recent success rate is acceptable
- audit capacity is available
- corroboration capacity is available
- the cost budget has headroom

Decrease or pause a worker pool when failures, duplicates, backlog, policy violations, or cost rise.

## Retry policy
Every retryable unit must track attempts and a next-available time. Retries should back off. After the configured maximum, move the work to `blocked`/dead-letter review rather than retrying forever.

## Knowledge-gap priority
New missions should prefer gaps created by:
1. real user/Panta questions that could not be answered from verified knowledge
2. candidate claims needing independent corroboration
3. stale verified knowledge due for recheck
4. approved high-value industry/regulatory updates
5. exploratory research only when budget and downstream capacity remain

## Minimum dashboard counters
- heartbeat age
- queued executions
- active executions
- stale/expired leases
- completed executions
- failed executions
- blocked executions
- research jobs queued/running/completed/failed
- quarantined evidence count
- audit-ready/audit-passed/audit-rejected counts
- candidate claims awaiting corroboration
- verified intelligence count and promotions/day
- duplicate missions prevented
- workers active/paused
- source failures
- estimated model/research spend today

## Self-sustaining does not mean self-authorizing
The factory may autonomously perform routine approved knowledge work. It may not autonomously weaken authentication, add credentials, broaden restricted source access, bypass audit/corroboration, or perform destructive production changes.

## First optimization target
Do not maximize Worker Bee count first. Maximize **completed verified knowledge per unit of cost** while keeping audit and corroboration healthy.
