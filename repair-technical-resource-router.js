/* TruckFixHub Technical Resource Router v1
   Learns from the best catalog workflow idea: identification should lead to the right technical document,
   not just a replacement number. TruckFixHub does not reproduce third-party proprietary catalogs.
*/
(function(){'use strict';
const TYPES={CATALOG:'catalog/application listing',INTERCHANGE:'OEM/competitive interchange',BULLETIN:'technical bulletin',INSTALL:'installation/service instructions',SAFETY:'safety/service information',NOMENCLATURE:'part-number nomenclature',SCHEMATIC:'schematic/exploded view',SPEC:'specification/dimension guide'};
const TRUST={OEM:1,MANUFACTURER:1,AUTHORIZED_PUBLICATION:2,DISTRIBUTOR_RESOURCE:3,COMMUNITY:5};
const registry=[
 {id:'automann-resource-center',publisher:'Automann',trust:3,type:'resource-index',topics:['parts','catalog','technical bulletin','installation','safety','interchange'],url:'https://www.automann.com/resources',note:'Discovery source. Follow through to the original manufacturer/public technical document when possible.'},
 {id:'automann-afa-dd15',publisher:'Automann/AFA',trust:3,type:TYPES.CATALOG,topics:['detroit','dd15','engine','parts'],url:'https://www.automann.com/resources/index/index/category/catalogs/brand/AFA/?limit=24',note:'Quick-reference discovery; verify application/current OE information before ordering.'},
 {id:'automann-fontaine',publisher:'Automann/Fontaine',trust:2,type:TYPES.BULLETIN,topics:['fifth wheel','coupling','uncoupling','maintenance','fontaine'],url:'https://www.automann.com/resources/index/index/category/technical-bulletins-new/',note:'Safety-critical coupling information; exact fifth-wheel model and current Fontaine instructions govern.'},
 {id:'automann-tse',publisher:'Automann/TSE Brakes',trust:2,type:TYPES.NOMENCLATURE,topics:['brake chamber','air brake','disc brake','push rod','clevis','tse'],url:'https://www.automann.com/resources/index/index/category/technical-bulletins-new/brand/TSE%20Brakes/',note:'Useful for identification/service routing; brake work remains safety-critical.'}
];
function norm(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function text(e={}){return norm([e.partNumber,e.brand,e.category,e.description,e.engine,e.componentModel,e.transmission,e.axle,e.symptom,e.systemProblem].filter(Boolean).join(' '))}
function route(e={}){const t=text(e);return registry.map(r=>{let score=0;(r.topics||[]).forEach(k=>{if(t.includes(norm(k)))score+=8});if(e.preferredType&&r.type===e.preferredType)score+=10;score-=Math.max(0,r.trust-1)*2;return{...r,score,verificationRequired:true}}).filter(r=>r.score>0).sort((a,b)=>b.score-a.score)}
function requiredResourceTypes(e={}){const t=text(e),out=[TYPES.CATALOG,TYPES.INTERCHANGE];if(/brake|fifth wheel|steer|wheel end|air system/.test(t))out.push(TYPES.SAFETY,TYPES.INSTALL);if(/unknown|identify|number|stamped|tag/.test(t))out.push(TYPES.NOMENCLATURE,TYPES.SPEC);if(/diagram|callout|schematic|exploded/.test(t))out.push(TYPES.SCHEMATIC);return[...new Set(out)]}
function auditSelection(resources=[]){const warnings=[];if(!resources.length)warnings.push('No technical resource selected.');if(resources.length&&!resources.some(r=>r.trust<=2))warnings.push('No OEM/manufacturer-level source selected yet.');if(resources.some(r=>r.trust>=3))warnings.push('Distributor/resource-center information is useful for discovery but should not outrank current OEM/manufacturer application or safety data.');return{pass:warnings.length===0,warnings}}
window.TFHTechnicalResourceRouter={TYPES,TRUST,registry,route,requiredResourceTypes,auditSelection,policy:'Technical documents are evidence with provenance and date/version context. Discovery catalogs, interchange tables and distributor availability never prove a diagnosis or fit by themselves.'};
})();