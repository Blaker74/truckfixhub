# TruckFixHub Knowledge Bank — Source Index

## Purpose
This index is the control center for TruckFixHub's manufacturer-grade knowledge sources. The knowledge bank is designed to organize reliable heavy-duty truck information without republishing copyrighted manuals or blindly treating third-party information as authoritative.

## Source priority
When sources conflict, TruckFixHub should generally prefer information in this order:
1. Current official manufacturer service literature for the exact model/application.
2. Current official manufacturer operator/maintenance literature.
3. Current official manufacturer parts/catalog information.
4. Official manufacturer public product/support information.
5. Reputable technical references and industry sources.
6. Community experience as a diagnostic clue, not proof.

Exact service procedures, torque specifications, fluid requirements, maintenance intervals, calibrations, part numbers, fault-code troubleshooting and warranty information should be verified against the current source for the exact vehicle/component.

## Current official-source library

### Detroit DD Heavy Duty Platform Operators Manual
- File: `detroit-dd-heavy-duty-platform-operators-manual.md`
- Authority: Official Detroit / DTNA operator manual
- Manual: DDC-SVC-MAN-0189
- Coverage: DD13, DD15, DD16
- Key subjects: engine identification, DDEC, starting/operation, engine brake, engine systems, aftertreatment, warning lamps, DEF/SCR, preventive maintenance and specifications.
- Diagnostic strengths: engine/generation identification, warning-lamp interpretation, SPN/FMI intake logic and manufacturer safety anchors.

### Demand Detroit — Official Manufacturer Site
- File: `demand-detroit-official-site.md`
- Authority: Official Detroit manufacturer website
- Coverage: current and legacy Detroit ecosystem
- Key subjects: DD engines, Series 50/60, MBE, DT12, Detroit axles, integrated powertrain, Detroit Connect / Virtual Technician, aftertreatment, Genuine/Reman parts and service programs.
- Diagnostic strengths: integrated-system reasoning, DPF soot-vs-ash logic, regeneration reasoning, current product/service context and multi-code relationships.

### Detroit Series 60 Reman Engines — DTNA PartsCap
- File: `detroit-series-60-reman-engines-partscap.md`
- Authority: Official DTNA PartsCap parts information
- Coverage: Detroit Series 60 reman engine offerings and application groupings
- Key subjects: complete engine, three-quarter, long-block configurations, 12.7 L / 14 L, PRE-EGR, DDEC generations, EPA02/EPA04/EPA07 and reman part-number references.
- Parts rule: application-specific part numbers must be verified before ordering or representing interchangeability.

## Core knowledge rules
### Rule 1 — Identify before diagnosing
**ENGINE / COMPONENT → GENERATION / APPLICATION → COMPLAINT → FAULTS / TESTS → PROVEN CAUSE**

### Rule 2 — A code is a direction, not a part number
Never teach:
**FAULT CODE → REPLACE THE PART NAMED IN THE DESCRIPTION.**

Use the code to identify the affected system/condition, then test wiring, connectors, power/ground, sensors, actuators, mechanical conditions and control logic as appropriate.

### Rule 3 — Keep generations separated
EPA/emissions generations and product revisions can change component layouts, controls, maintenance requirements, aftertreatment strategies and diagnostic procedures. Do not merge generation-specific information into a universal answer.

### Rule 4 — Separate soot from ash
Regeneration can address combustible soot under appropriate conditions. It does not remove non-combustible accumulated ash. Repeated regen attempts are not a substitute for diagnosis or scheduled physical DPF service.

### Rule 5 — Diagnose integrated systems as integrated systems
Modern Detroit engine, transmission, aftertreatment and vehicle-control systems exchange information. Multiple faults may be related. Look for primary/secondary relationships, shared power/ground, communication and protection strategies before assuming multiple independent component failures.

### Rule 6 — Preserve manufacturer safety meaning
TruckFixHub may simplify language but must not simplify away safety. High-pressure fuel, hot coolant, rotating equipment, electrical systems, batteries, parked regeneration, hot aftertreatment components and accidental engine starting require manufacturer safety precautions.

### Rule 7 — Community knowledge does not outrank manufacturer facts
Community reports can reveal patterns and practical experience, but they should be presented as experience/clues unless independently supported. They do not override official specifications, warnings or service procedures.

### Rule 8 — Never hide a source conflict
If two credible sources disagree, TruckFixHub should not silently choose whichever answer is easiest. First check whether the sources apply to different model years, emissions generations, serial-number ranges, applications or revision dates. If the conflict cannot be resolved from available evidence, say that verification is required.

**CONFLICT → CHECK APPLICATION → CHECK REVISION → CHECK GENERATION → VERIFY**

### Rule 9 — Match confidence to evidence
TruckFixHub should distinguish between what is known and what is merely plausible.
- **Manufacturer-confirmed:** directly supported by the applicable official source.
- **Strongly supported:** multiple reliable sources agree and no applicable manufacturer source conflicts.
- **Diagnostic possibility:** technically plausible but still requires testing.
- **Community pattern:** reported field experience that may help direct inspection but is not proof.
- **Unknown / needs verification:** available sources do not support a dependable answer.

Never convert “common failure” into “failed part” without evidence from the truck.

### Rule 10 — Missing information is a diagnostic input
When an exact answer depends on information the user has not supplied, ask for the smallest useful identifier rather than guessing. Examples include engine serial number, VIN, model year, emissions generation, complete SPN/FMI, transmission model, axle model, component tag or part number.

The goal is not to make the user collect everything. Ask only for what materially changes the answer.

## Diagnostic evidence ladder
TruckFixHub should move from cheap, safe evidence toward invasive or expensive action. Do not jump directly from symptom to replacement.

### Level 1 — Complaint
Capture what the truck is actually doing in the user's own language: won't crank, low power, overheats, loses air, vibrates, won't shift, warning light, regen request, smoke, noise, etc.

### Level 2 — Identity
Determine only the identifiers that materially affect the path: truck/VIN, engine family and serial, emissions generation, transmission/axle/component model as needed.

### Level 3 — Visible / basic checks
Look for evidence available without unnecessary disassembly: fluid level/condition, leaks, loose or damaged wiring, connectors, hoses, belts, clamps, grounds, battery condition, obvious damage, contamination, restriction indicators and component tags.

### Level 4 — Fault and operating data
Capture complete SPN/FMI or OEM fault information and relevant live/operating data. Preserve related codes before clearing them. Compare commanded versus actual values when the applicable diagnostic procedure uses them.

### Level 5 — Directed test
Use the applicable manufacturer procedure to test the suspected circuit/system mechanically or electrically. A directed test should answer a specific question rather than merely produce more data.

### Level 6 — Proven cause
Condemn a component only when the evidence supports it. The fact that a part is common, named in a code description or easy to replace is not proof.

### Level 7 — Repair verification
After repair, confirm the original complaint is corrected under appropriate conditions and verify that related faults do not immediately return.

**COMPLAINT → IDENTITY → BASIC CHECK → DATA → DIRECTED TEST → PROVEN CAUSE → VERIFY REPAIR**

## Symptom-to-system routing
TruckFixHub should begin with the driver's complaint whenever possible, then route toward systems instead of asking a user to already know which component is bad.

### Won't crank
Start with:
- Battery state / voltage and connections
- Main power and grounds
- Starter / solenoid command path
- Ignition/start-enable path
- Neutral / clutch / interlock conditions where applicable
- Vehicle/engine control power and communication if the basic starting circuit is intact

Do not begin by blaming the starter simply because the engine does not crank.

### Cranks but won't start
Separate this from “won't crank.” Start with:
- Engine speed / crank signal recognition
- Fuel supply and fuel-pressure requirements
- Engine-control power / communication
- Required enable conditions
- Active faults and relevant manufacturer-directed checks

### Low power
Route across systems rather than treating “low boost” as the only possibility:
- Active derate / engine protection / aftertreatment status
- Air intake and charge-air restriction/leaks
- Fuel supply / pressure / restriction
- Turbo / boost control
- Exhaust / aftertreatment restriction
- Sensor plausibility / commanded-versus-actual data
- Mechanical engine condition when evidence points there

### Overheating
Start with safe cooling-system basics:
- Coolant level only when safe to inspect
- External leaks
- Fan operation / command
- Belt / drive condition where applicable
- Radiator / charge-air-cooler airflow restriction
- Thermostat / circulation / water-pump concerns when supported
- Combustion-gas or internal-engine causes only after simpler evidence is considered

Never instruct removal of a hot pressurized cooling-system cap.

### Losing air / air leak
Route by whether the complaint is supply, leakage or application related:
- Compressor / build rate
- Governor / unloading behavior
- Reservoirs / drains / check valves
- Audible/external leaks
- Brake valves / chambers / hoses
- Air suspension / accessories
- Pressure-protection behavior

Brake-air complaints are safety-critical; TruckFixHub should distinguish “find the leak” education from permission to operate an unsafe vehicle.

### Vibration
First separate when it occurs:
- Engine speed related while stationary
- Vehicle-speed related
- Acceleration / torque related
- Deceleration related
- Braking related

Then route toward engine/accessories, wheels/tires, driveline/U-joints, driveshaft, transmission, axle/differential, suspension or brakes based on that pattern. Do not begin by replacing driveline parts without identifying when the vibration occurs.

### Won't shift / shifting problem
Start with:
- Exact transmission type/model
- Active transmission/engine faults
- Air supply where applicable
- Clutch actuation / clutch condition where applicable
- Power/ground / communication
- Shift-control inputs and enable conditions
- Mechanical transmission concerns only when evidence supports them

For integrated automated transmissions, consider engine torque/protection information shared across the powertrain.

### Warning light / fault code
Route:
**EXACT LAMP/MESSAGE → COMPLETE CODE → SYSTEM → BASIC CHECK → DIRECTED TEST**

Never route directly from a code description to a replacement part.

### Regen / DPF complaint
Route:
- Engine/emissions generation
- All active faults
- Soot versus ash
- Regen enable conditions
- Temperature generation / dosing / sensor evidence
- Abnormal soot-production causes
- Scheduled physical DPF service where applicable

Repeated regen is not a substitute for diagnosis.

### Smoke
First identify smoke appearance and operating condition, but avoid claiming color alone proves a specific failed part. Route toward fuel/combustion, air supply/boost, oil consumption, coolant intrusion, aftertreatment or mechanical engine condition based on supporting evidence.

## Parts-cannon prevention
Before recommending replacement of an expensive component, TruckFixHub should be able to answer:
- What evidence points to this component?
- What simpler causes have been ruled out?
- Is the component receiving the correct power, ground, air, fuel, fluid, command or mechanical input it requires?
- Could wiring, connectors, plumbing, contamination, restriction, another module or a mechanical condition create the same symptom?
- What test or manufacturer procedure proves the replacement decision?

If those questions cannot be answered, present the component as a possibility, not a diagnosis.

## Knowledge response standard
When TruckFixHub turns knowledge-bank material into a user-facing answer, organize it in this order whenever practical:
1. **What it means** — plain-language explanation.
2. **What to check first** — safest/highest-value first inspection or test.
3. **What could cause it** — ordered possibilities, not a parts list.
4. **What proves it** — the observation/test that separates possibilities.
5. **What information is still needed** — only when necessary.
6. **Safety / stop condition** — when the complaint creates a meaningful risk.
7. **Source confidence** — manufacturer-confirmed vs diagnostic possibility when that distinction matters.

Keep the front end childlike-simple while preserving the deeper technical reasoning underneath.

## Growth structure
Add future manufacturer sources as separate Markdown records under `knowledge-bank/` and list them here. Each record should include:
- Publisher/manufacturer
- Source title and document number when available
- Revision/date when available
- Models/systems covered
- Official source location
- High-value topic index
- Safety anchors where relevant
- TruckFixHub indexing/search terms
- Copyright/source-handling note

Do not copy complete copyrighted manuals into this repository unless TruckFixHub has explicit rights to host them. Prefer structured indexing, original summaries and links back to the official source.

## Current manufacturer coverage
- Detroit / Detroit Diesel / DTNA: ACTIVE
- Cummins: future official-source expansion
- Eaton / Eaton Cummins: future official-source expansion
- Meritor / Cummins-Meritor: future official-source expansion
- Bendix: future official-source expansion
- WABCO / ZF: future official-source expansion
- Freightliner / Western Star vehicle literature: future official-source expansion

## Mission
TruckFixHub's knowledge bank should become a structured map of heavy-duty knowledge: authoritative enough to be useful, simple enough to understand, and disciplined enough to say **verify the exact application** when the source does not support a universal answer.