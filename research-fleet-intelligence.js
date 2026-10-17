/* TruckFixHub Fleet & Community Intelligence v1
   Public-data research model. Discovery is not verification.
   Do not use this module to harass, profile individuals, expose private data,
   or label a carrier safe/unsafe from a single metric.
*/
(function(){'use strict';
const SOURCE_CLASSES={
 GOVERNMENT:{tier:1,examples:['FMCSA','NHTSA','DOT','EPA']},
 INDUSTRY_ORG:{tier:2,examples:['TMC','ATA','state trucking associations']},
 FLEET_PUBLICATION:{tier:3},
 COMPANY_PUBLIC:{tier:3},
 COMMUNITY:{tier:4}
};
const MISSIONS=[
 'fleet-discovery','fleet-size-and-operation','equipment-and-application-patterns',
 'maintenance-concerns','diagnostics-and-breakdowns','parts-and-cost-pressure',
 'technician-shortage-and-training','safety-and-recalls','community-assistance',
 'apprenticeships-and-careers','small-fleet-resources','industry-organizations'
];
const PUBLIC_FIELDS=['usdot','legalName','dbaName','operationType','carrierClassification','cargoTypes','powerUnits','drivers','reportedMileage','reportedMileageYear','publicWebsite','publicBusinessPhone','state','fleetSizeBand'];
const PROHIBITED=['private-personal-data','credentials','nonpublic-contact-data','individual-driver-profiling','harassment-targeting','unsupported-safe-unsafe-label','commercial-ranking-based-on-payment'];
function band(n){n=Number(n);if(!Number.isFinite(n)||n<0)return'unknown';if(n<=6)return'1-6';if(n<=20)return'7-20';if(n<=100)return'21-100';return'100+'}
function normalizeFleet(raw={}){const powerUnits=Number(raw.powerUnits||raw.power_units||0)||0;return{usdot:String(raw.usdot||raw.dot||''),legalName:String(raw.legalName||raw.legal_name||''),dbaName:String(raw.dbaName||raw.dba_name||''),operationType:String(raw.operationType||raw.operation||''),carrierClassification:raw.carrierClassification||[],cargoTypes:raw.cargoTypes||[],powerUnits,drivers:Number(raw.drivers||0)||0,reportedMileage:Number(raw.reportedMileage||raw.mileage||0)||0,reportedMileageYear:String(raw.reportedMileageYear||raw.mileageYear||''),publicWebsite:String(raw.publicWebsite||''),publicBusinessPhone:String(raw.publicBusinessPhone||''),state:String(raw.state||''),fleetSizeBand:band(powerUnits),source:raw.source||null,retrievedAt:raw.retrievedAt||new Date().toISOString(),status:'quarantined'}}
function researchNeeds(f={}){const needs=[];if(!f.operationType)needs.push('operation type');if(!f.cargoTypes||!f.cargoTypes.length)needs.push('cargo/application');if(!f.powerUnits)needs.push('fleet size');needs.push('maintenance concerns','equipment/application evidence','training/workforce resources','relevant community/industry assistance');return[...new Set(needs)]}
function communityOpportunity(e={}){const out=[];const text=JSON.stringify(e).toLowerCase();if(/technician|staffing|shortage|training/.test(text))out.push('technician training, apprenticeship and recruiting resources');if(/cost|inflation|parts/.test(text))out.push('parts identification, cross-reference, maintenance-cost and small-fleet resources');if(/breakdown|diagnostic|root cause/.test(text))out.push('diagnostic workflow, roadside and qualified repair resources');if(/aftertreatment|emission|dpf|def|scr/.test(text))out.push('manufacturer and regulatory aftertreatment education');return out}
function audit(record={}){const issues=[],warnings=[];if(!record.source)issues.push('missing provenance');if(!record.retrievedAt)issues.push('missing retrieval date');if(record.source&&Number(record.source.tier||99)>3)warnings.push('low-authority source: discovery only');if(record.safetyLabel)issues.push('remove unsupported carrier safety label; preserve underlying public metrics and context instead');return{pass:issues.length===0,issues,warnings}}
window.TFHFleetIntelligence={SOURCE_CLASSES,MISSIONS,PUBLIC_FIELDS,PROHIBITED,band,normalizeFleet,researchNeeds,communityOpportunity,audit,policy:'Research fleets to understand industry needs and connect people with legitimate help. Use public organizational data with provenance; protect individuals; do not turn public safety metrics into unsupported safe/unsafe judgments.'};
})();