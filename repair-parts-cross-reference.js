/* TruckFixHub Heavy-Duty Parts Cross-Reference Engine v1
   Purpose: recognize, normalize, load and rank thousands of heavy-duty part numbers.
   Safety/integrity rule: a cross-reference is a candidate until application/spec/fit is verified.
*/
(function(){'use strict';

const SOURCE_TIERS={OEM:1,MANUFACTURER:1,VERIFIED_CATALOG:2,DISTRIBUTOR:3,COMMUNITY:5};
const db=new Map();
const aliases=new Map();

function normalizePartNumber(value){
  return String(value||'').toUpperCase().trim().replace(/^PART\s*(NO|NUMBER|#)?\s*[:.-]?\s*/i,'').replace(/[^A-Z0-9]/g,'');
}
function key(brand,number){return `${String(brand||'').toUpperCase().trim()}|${normalizePartNumber(number)}`}
function addAlias(alias,canonical){const a=normalizePartNumber(alias);if(a)aliases.set(a,canonical)}
function ingest(record){
  if(!record||!record.number)return false;
  const r={...record};
  r.brand=String(r.brand||'UNKNOWN').trim();
  r.number=String(r.number).trim();
  r.normalized=normalizePartNumber(r.number);
  r.category=String(r.category||'unknown').trim();
  r.sourceTier=Number(r.sourceTier||SOURCE_TIERS.DISTRIBUTOR);
  r.crosses=Array.isArray(r.crosses)?r.crosses:[];
  r.applications=Array.isArray(r.applications)?r.applications:[];
  r.attributes=r.attributes||{};
  r.sources=Array.isArray(r.sources)?r.sources:[];
  r.status=r.status||'candidate';
  const k=key(r.brand,r.number);
  db.set(k,r);
  addAlias(r.number,k);
  (r.aliases||[]).forEach(a=>addAlias(a,k));
  return true;
}
function ingestMany(records){let n=0;(records||[]).forEach(r=>{if(ingest(r))n++});return n}
function exact(number){
  const n=normalizePartNumber(number), out=[];
  for(const r of db.values())if(r.normalized===n)out.push(r);
  return out.sort((a,b)=>a.sourceTier-b.sourceTier);
}
function search(query){
  const n=normalizePartNumber(query); if(!n)return [];
  const scored=[];
  for(const r of db.values()){
    let score=0;
    if(r.normalized===n)score+=100;
    else if(r.normalized.startsWith(n)||n.startsWith(r.normalized))score+=35;
    if((r.aliases||[]).some(a=>normalizePartNumber(a)===n))score+=90;
    if((r.crosses||[]).some(c=>normalizePartNumber(c.number||c)===n))score+=80;
    if(score)scored.push({record:r,score:score-Math.min(r.sourceTier,9)});
  }
  return scored.sort((a,b)=>b.score-a.score);
}
function crossReference(number,options={}){
  const matches=search(number), results=[];
  matches.forEach(m=>{
    const r=m.record;
    results.push({brand:r.brand,number:r.number,category:r.category,score:m.score,relationship:'input-match',status:r.status,sourceTier:r.sourceTier,applications:r.applications,attributes:r.attributes,sources:r.sources});
    (r.crosses||[]).forEach(c=>{
      const obj=typeof c==='string'?{number:c}:c;
      results.push({brand:obj.brand||'UNKNOWN',number:obj.number,category:obj.category||r.category,score:m.score-10,relationship:obj.relationship||'cross-reference-candidate',status:obj.status||'candidate',sourceTier:obj.sourceTier||r.sourceTier,applications:obj.applications||[],attributes:obj.attributes||{},sources:obj.sources||r.sources});
    });
  });
  return rankForApplication(results,options);
}
function rankForApplication(results,options={}){
  return (results||[]).map(x=>{
    let score=x.score||0;
    if(options.brand&&String(x.brand).toLowerCase()===String(options.brand).toLowerCase())score+=8;
    if(options.category&&x.category===options.category)score+=12;
    if(options.application&&(x.applications||[]).some(a=>JSON.stringify(a).toLowerCase().includes(String(options.application).toLowerCase())))score+=15;
    score-=Math.max(0,(x.sourceTier||3)-1)*3;
    return {...x,score,verificationRequired:true};
  }).sort((a,b)=>b.score-a.score);
}
function validateCandidate(candidate,application={}){
  const warnings=[];
  if(!candidate)warnings.push('No candidate supplied.');
  if(candidate&&candidate.status!=='verified')warnings.push('Cross-reference is not marked verified.');
  if(candidate&&(!candidate.sources||!candidate.sources.length))warnings.push('No provenance/source attached.');
  if(!application.partNumber&&!application.vin&&!application.engineSerial&&!application.componentModel)warnings.push('Application identity is incomplete.');
  return {ok:warnings.length===0,warnings,rule:'Never order/install from number similarity alone. Verify current manufacturer/OEM application, dimensions/specification, supersession and safety-critical fit.'};
}
function exportRecords(){return Array.from(db.values())}

// Schema supports bulk-generated datasets from licensed/allowed manufacturer catalogs and verified user imports.
const schema={brand:'string',number:'string',aliases:['string'],category:'string',description:'string',crosses:[{brand:'string',number:'string',relationship:'direct|supersession|alternate|candidate'}],applications:[{make:'string',model:'string',year:'string',engine:'string',component:'string'}],attributes:{},sources:[{name:'string',url:'string',date:'string'}],sourceTier:'1 OEM/manufacturer; 2 verified catalog; 3 distributor; 5 community',status:'candidate|verified|superseded'};

window.TFHPartsCrossReference={SOURCE_TIERS,schema,normalizePartNumber,ingest,ingestMany,exact,search,crossReference,rankForApplication,validateCandidate,exportRecords,policy:'Cross-reference means candidate interchange, not confirmed fit. Manufacturer/OEM application and specifications outrank number similarity, distributor availability, frequency, and community reports.'};
})();