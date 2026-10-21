/* TruckFixHub reusable knowledge graph.
   One concept can point users to symptoms, systems, fault-code drawers,
   diagrams and beginner explanations without duplicating the knowledge. */
window.TFH_KNOWLEDGE_GRAPH = {
  version: 1,
  standard: ["see", "name", "test", "prove", "share"],
  evidenceLabels: {
    verified: "Verified",
    field: "Field experience",
    needsVerification: "Needs verification"
  },
  topics: [
    {id:"starting-no-crank",title:"Won't crank",aliases:["no crank","click no start","starter won't turn"],system:"starting",symptom:"Engine does not crank",beginner:"First decide whether the problem is supply, command, starter circuit or mechanical load.",diagram:"diagrams/starting-no-crank-diagnostic/",learn:"starting-symptoms.html",evidence:"verified"},
    {id:"crank-no-start",title:"Cranks but won't start",aliases:["crank no start","turns over won't start"],system:"engine",symptom:"Engine cranks but does not run",beginner:"Cranking and starting are different jobs. Prove speed, fuel, air, electrical inputs and combustion requirements instead of replacing a starter.",diagram:"diagrams/crank-no-start-diagnostic/",learn:"starting-symptoms.html",evidence:"verified"},
    {id:"j1939",title:"J1939 datalink problem",aliases:["j1939","data link","datalink","modules offline","communication fault"],system:"electrical-network",symptom:"Modules cannot communicate normally",beginner:"Think of J1939 as the truck's group conversation. Check power and grounds before blaming the conversation wires.",diagram:"diagrams/j1939-datalink-diagnostic/",learn:"electrical-diagnostics.html",evidence:"verified"},
    {id:"low-voltage",title:"Low voltage / electrical fault",aliases:["low voltage","battery voltage","charging problem","bad ground"],system:"electrical",symptom:"Electrical supply is weak, unstable or missing",beginner:"Voltage tells you pressure is available; a loaded circuit tells you whether it can actually do work.",diagram:"diagrams/voltage-electrical-fault/",learn:"electrical-diagnostics.html",evidence:"verified"},
    {id:"overheating",title:"Engine overheating",aliases:["overheating","running hot","getting hot","high coolant temp"],system:"cooling",symptom:"Engine temperature rises too high",beginner:"Break cooling into quantity, airflow, circulation and pressure. Prove which job is failing.",diagram:"diagrams/overheating-diagnostic/",learn:"cooling-system.html",evidence:"verified"},
    {id:"low-power",title:"Low power / derate",aliases:["low power","derate","won't pull","sluggish"],system:"engine-performance",symptom:"Truck cannot produce expected power",beginner:"Do not start with the turbo. Air, fuel, combustion, exhaust restriction, controls and aftertreatment can all reduce power.",diagram:"diagrams/low-power-diagnostic/",learn:"engine-performance-symptoms.html",evidence:"verified"},
    {id:"low-boost",title:"Low boost / turbo complaint",aliases:["low boost","turbo problem","no boost"],system:"air-management",symptom:"Boost pressure is lower than expected",beginner:"The turbo is only one part of the air path. Check demand, leaks, restrictions, exhaust energy and controls before condemning it.",diagram:"diagrams/low-boost-turbo-diagnostic/",learn:"engine-performance-symptoms.html",evidence:"verified"},
    {id:"regen-no-start",title:"Regen will not start",aliases:["regen won't start","regen will not start","parked regen","regen problem"],system:"aftertreatment",symptom:"Requested regeneration will not begin",beginner:"A regen needs permission. Find the condition preventing enablement before replacing aftertreatment parts.",diagram:"diagrams/regen-will-not-start/",learn:"aftertreatment-symptoms.html",evidence:"verified"},
    {id:"spn-4364",title:"SPN 4364 SCR efficiency path",aliases:["4364","spn 4364","scr efficiency"],system:"aftertreatment",symptom:"SCR efficiency-related fault reported",beginner:"Treat the SPN as a clue. Confirm the reporting module and FMI, then test the complete SCR process and supporting sensors.",diagram:"diagrams/spn-4364-scr-efficiency/",learn:"fault-codes.html",evidence:"verified"},
    {id:"spn-3251",title:"SPN 3251 DPF pressure path",aliases:["3251","spn 3251","dpf pressure","dpf differential pressure"],system:"aftertreatment",symptom:"DPF differential-pressure-related fault reported",beginner:"Check the pressure measurement system and its plumbing as well as actual restriction. A pressure code does not automatically mean the DPF is bad.",diagram:"diagrams/spn-3251-dpf-pressure/",learn:"fault-codes.html",evidence:"verified"},
    {id:"hot-wheel-end",title:"Hot wheel end",aliases:["hot hub","hot wheel","wheel end hot","hot brake"],system:"wheel-end-brakes",symptom:"One wheel end is hotter than expected",beginner:"Separate brake heat from bearing, lubrication, adjustment and mechanical causes before disassembly.",diagram:"diagrams/hot-wheel-end-diagnostic/",learn:"wheel-end-knowledge.html",evidence:"verified"},
    {id:"wheel-seal-leak",title:"Wheel seal / hub leak",aliases:["wheel seal leak","hub leak","oil on brakes","leaking hub"],system:"wheel-end",symptom:"Lubricant is escaping from the wheel end",beginner:"Identify the fluid and exact source first. Then inspect contamination and prove why the seal lost control of the lubricant.",diagram:"diagrams/wheel-seal-leak-diagnostic/",learn:"wheel-end-knowledge.html",evidence:"verified"},
    {id:"steering-pull",title:"Steering pull / wander",aliases:["pulls","wanders","steering pull","truck wanders"],system:"steering-suspension",symptom:"Truck will not track normally",beginner:"Start with tires and wheel ends, then linkage, suspension and geometry. Do not jump straight to alignment.",diagram:"diagrams/steering-pull-wander-diagnostic/",learn:"steering-suspension-symptoms.html",evidence:"verified"}
  ]
};

window.TFHKnowledge = {
  find: function(query){
    var q=(query||"").trim().toLowerCase();
    if(!q) return [];
    return window.TFH_KNOWLEDGE_GRAPH.topics.filter(function(t){
      return t.title.toLowerCase().includes(q) || t.symptom.toLowerCase().includes(q) || t.system.toLowerCase().includes(q) || t.aliases.some(function(a){return a.includes(q)||q.includes(a);});
    });
  },
  bySystem: function(system){return window.TFH_KNOWLEDGE_GRAPH.topics.filter(function(t){return t.system===system;});},
  byId: function(id){return window.TFH_KNOWLEDGE_GRAPH.topics.find(function(t){return t.id===id;});}
};