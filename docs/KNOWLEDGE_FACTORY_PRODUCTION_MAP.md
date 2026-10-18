# TruckFixHub Knowledge Factory — Live Production Map

Issue: #19

This map is based on a live read of the Supabase `public` schema. It distinguishes structures that actually exist from the runtime behavior still requiring proof or enforcement.

## Live government structure confirmed

| Factory role | Live Supabase structure | Current observed rows | What it provides |
|---|---|---:|---|
| Constitution/rules | `tfh_ai_government_rules` | 42 | Government rules with authority levels and enable flags |
| Departments | `tfh_ai_departments` | 9 | Department jurisdiction and execution/review capabilities |
| Mission | `tfh_ai_mission` | 1 | Mission and success definition |
| Priorities | `tfh_ai_government_priorities` | 7 | Ordered government principles |
| Worker types | `tfh_worker_bee_types` | 16 | Worker missions, departments, priorities and enable flags |
| Worker instances | `tfh_worker_bee_instances` | 16 | Worker status, current work, completion/failure counts, heartbeat and performance |
| Problems | `tfh_problem_queue` | 15 | Identified problems with urgency, impact, evidence strength and assignment |
| Work orders | `tfh_problem_work` | 17 | Discover/research/corroborate/challenge/synthesize/recheck/monitor work |
| Execution queue | `tfh_ai_execution_queue` | 10 | Leaseable execution units with risk, attempts and status |
| Worker handoffs | `tfh_worker_bee_handoffs` | 8 | Evidence/audit/corroboration/safety/source-review/knowledge-gap handoffs |
| Runtime switch | `tfh_ai_runtime_control` | 1 | Autonomous execution enable/pause control |
| System health | `tfh_ai_system_health` | 25 | Component health, last success/check and consecutive failures |
| Performance events | `tfh_worker_performance_events` | 0 | Promotion/demotion/retirement/recovery event ledger |
| Production metrics | `tfh_production_metrics` | 279 | Queue/evidence/claim/search/blocked metrics history |

## Live research and learning pipeline confirmed

| Factory stage | Live Supabase structure | Current observed rows | Key safeguards/state |
|---|---|---:|---|
| Approved sources | `tfh_research_sources` | 15 | Trust tier, crawl permission, enabled/login/robots/terms/rate-limit fields |
| Research jobs | `tfh_research_jobs` | 3 | Queue/lease/completion/failure/blocked states, attempts, max attempts, lease expiry |
| Evidence quarantine | `tfh_research_evidence` | 2 | Defaults to `quarantined` and `verified=false`; audit state/scores/lineage |
| Candidate claims | `tfh_research_claims` | 2 | Candidate/corroborating/conflicted/review/verified/rejected/stale states |
| Claim ↔ evidence lineage | `tfh_research_claim_evidence` | 2 | Support/contradict/context stance and agent role |
| AI lessons | `tfh_ai_lessons` | 0 | Review/approved/suspended/retired learning state |
| AI reviews | `tfh_ai_reviews` | 0 | Skeptic/teacher/auditor verdict records |
| Verified intelligence | `tfh_verified_intelligence` | 0 | Final verified intelligence store with confidence and expiry |

## Live knowledge-gap/search structures confirmed

- `tfh_search_knowledge_gaps` exists and currently has 0 rows.
- `tfh_search_queries` and `tfh_search_result_events` exist for search feedback.
- `tfh_search_index` exists as the searchable knowledge layer and currently has 0 rows.
- `tfh_search_opportunities` and `tfh_search_page_candidates` exist for turning useful evidence into discoverable content.

## What this proves

The government is not merely a diagram. The live database contains real departments, worker definitions, worker instances, work orders, execution queues, handoffs, runtime controls, health records, source policy, evidence quarantine, audit state, claims, lineage, verified-intelligence storage and knowledge-gap storage.

## What this does NOT prove

Table existence and row counts do not prove that every transition is automatically executing correctly 24/7. In particular:

- `tfh_verified_intelligence` currently has 0 rows.
- `tfh_ai_lessons` currently has 0 rows.
- `tfh_ai_reviews` currently has 0 rows.
- `tfh_search_knowledge_gaps` currently has 0 rows.
- `tfh_search_index` currently has 0 rows.
- worker records/status labels do not by themselves prove useful autonomous output.

Therefore the next runtime objective is not to invent more government tables. It is to make the existing structures reliably move work through the full loop.

## Existing schema already supports key 24/7 controls

The live schema already has fields needed for much of the control policy:

- bounded attempts: `tfh_research_jobs.attempts` + `max_attempts`
- leases: `leased_at` + `lease_expires_at`, and execution `lease_until`
- blocked state: research jobs and execution queue both support `blocked`
- source policy: enabled/crawl/robots/terms/login/rate-limit fields
- quarantine: evidence status + `verified=false`
- audit: audit state, score, authority/freshness/evidence scores
- corroboration: claim status + independent source count + evidence lineage
- health: component status + consecutive failures
- worker merit: completion/failure counters, rank and performance score
- pause switch: autonomous execution enabled + pause reason

## Highest-value restructuring sequence

1. **Runtime observability first** — produce a reliable health snapshot from existing tables.
2. **Dispatcher backpressure** — stop new collection when audit/corroboration is unhealthy.
3. **Worker reliability** — enforce leases, bounded retries, clean completion/failure and source policy.
4. **Automatic audit routing** — quarantined evidence must enter audit without Founder intervention.
5. **Automatic corroboration missions** — candidate claims with insufficient independent support create targeted work.
6. **Verified promotion** — only qualifying claims enter verified intelligence with lineage.
7. **Panta retrieval** — factual truck knowledge prefers verified intelligence.
8. **Knowledge-gap feedback** — weak/unanswered searches/questions create bounded new missions.
9. **Merit and self-healing** — pause failing workers/sources; reward useful audited output.
10. **24-hour unattended test** — prove the complete loop rather than assuming it works.

## Immediate bottleneck

The most important visible signal is that evidence and candidate claims exist, while verified intelligence is still empty. The next engineering work should therefore focus on **audit → corroboration → verified promotion**, while preserving source policy and cost controls, before increasing collection concurrency aggressively.
