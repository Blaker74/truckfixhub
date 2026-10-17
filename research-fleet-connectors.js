/* TruckFixHub Fleet Research Connectors v1
   Connects the research architecture to legitimate PUBLIC fleet information sources.
   IMPORTANT: this browser-safe module defines connector contracts and ingestion rules;
   actual scheduled/network collection belongs server-side so keys, rate limits and
   source policies can be enforced. Nothing collected here becomes verified knowledge
   without the Research Ingestion Auditor.
*/
(function(){'use strict';
const CONNECTORS={
 FMCSA_OPEN_DATA:{
  id:'fmcsa-open-data',publisher:'FMCSA / U.S. DOT',tier:1,mode:'public-dataset',
  purpose:['carrier discovery','USDOT identity','operation','equipment','drivers','mileage'],
  datasets:['Company Census File','SAFER Company Snapshot','public SMS input/output data'],
  refreshPolicy:'follow source dataset cadence; retain retrievedAt and source update date',
  rules:['public records only','use official dataset/API access when available','do not infer overall carrier safety from SMS metrics','preserve USDOT as organization key']
 },
 FLEET_PUBLIC_WEB:{
  id:'fleet-public-web',publisher:'fleet/company public websites',tier:3,mode:'public-web',
  purpose:['equipment disclosures','maintenance programs','careers','training','community programs','public contact channels'],
  rules:['robots and terms required','no login bypass','no employee harvesting','no personal emails/phones unless intentionally published as business contact','no hidden endpoint discovery']
 },
 INDUSTRY_ORGS:{
  id:'industry-organizations',publisher:'industry associations / public programs',tier:2,mode:'public-web',
  purpose:['maintenance research','workforce programs','training','scholarships','apprenticeships','community assistance'],
  rules:['capture eligibility/geography/cost/date','separate nonprofit/government/commercial status','advertising is not verification']
 }
};
function fleetKey(x={}){return x.usdot?`USDOT:${String(x.usdot).replace(/\D/g,'')}`:(x.legalName?`NAME:${String(x.legalName).trim().toUpperCase()}`:'UNKNOWN')}
function envelope(source,record={}){return{kind:'fleet-research-evidence',fleetKey:fleetKey(record),sourceId:source.id,sourceTier:source.tier,retrievedAt:new Date().toISOString(),sourceUpdatedAt:record.sourceUpdatedAt||null,sourceUrl:record.sourceUrl||'',publisher:record.publisher||source.publisher,record,status:'quarantined',verified:false}}
function sanitize(record={}){const r={...record};['personalEmail','personalPhone','driverName','driverDOB','driverLicense','ssn','credentials','password','token'].forEach(k=>delete r[k]);return r}
function ingest(connectorId,record={}){const source=Object.values(CONNECTORS).find(x=>x.id===connectorId);if(!source)throw new Error('Unknown fleet connector');const clean=sanitize(record);const item=envelope(source,clean);const ingestion=window.TFHResearchIngestion;if(ingestion&&typeof ingestion.quarantine==='function')return ingestion.quarantine({...item,claimType:'fleet-public-data',claim:'Public fleet organizational evidence for research and assistance routing'});return item}
function assistanceTopics(record={}){const t=JSON.stringify(record).toLowerCase(),out=[];if(/technician|mechanic|training|career|apprentice/.test(t))out.push('workforce-training');if(/maintenance|breakdown|repair|diagnostic/.test(t))out.push('maintenance-diagnostics');if(/parts|inventory|supply/.test(t))out.push('parts-support');if(/community|scholarship|nonprofit|foundation|veteran/.test(t))out.push('community-assistance');return [...new Set(out)]}
window.TFHFleetResearchConnectors={CONNECTORS,fleetKey,envelope,sanitize,ingest,assistanceTopics,policy:'Connect to public fleet and industry information, not private fleet systems. Every discovery is quarantined and audited before it can influence TruckFixHub intelligence.'};
})();