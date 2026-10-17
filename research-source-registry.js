/* TruckFixHub Research Source Registry v1
   Approved discovery starting points for future controlled research workers.
   A registry entry grants discovery permission inside TruckFixHub logic; it does NOT override a site's robots.txt, terms, licensing, authentication or copyright restrictions.
*/
(function(){'use strict';
const sources=[
 {id:'detroit',publisher:'Detroit Diesel / Daimler Truck',tier:1,kinds:['engine','aftertreatment','parts','service'],domains:['demanddetroit.com'],status:'approved-discovery'},
 {id:'cummins',publisher:'Cummins',tier:1,kinds:['engine','aftertreatment','parts','service','filtration'],domains:['cummins.com'],status:'approved-discovery'},
 {id:'eaton',publisher:'Eaton',tier:1,kinds:['transmission','clutch','parts','service','lubrication'],domains:['eaton.com'],status:'approved-discovery'},
 {id:'bendix',publisher:'Bendix Commercial Vehicle Systems',tier:1,kinds:['air-brake','abs','adas','parts','service'],domains:['bendix.com'],status:'approved-discovery'},
 {id:'zf',publisher:'ZF',tier:1,kinds:['wabco','abs','air-brake','driveline','parts','service'],domains:['zf.com'],status:'approved-discovery'},
 {id:'allison',publisher:'Allison Transmission',tier:1,kinds:['transmission','parts','service','fluids'],domains:['allisontransmission.com'],status:'approved-discovery'},
 {id:'meritor',publisher:'Meritor / Cummins-Meritor',tier:1,kinds:['axle','brake','driveline','wheel-end','parts'],domains:['meritor.com','cummins.com'],status:'approved-discovery'},
 {id:'stemco',publisher:'STEMCO',tier:1,kinds:['wheel-end','seals','bearings','brake'],domains:['stemco.com'],status:'approved-discovery'},
 {id:'fontaine',publisher:'Fontaine Fifth Wheel',tier:1,kinds:['fifth-wheel','coupling','parts','service'],domains:['fifthwheel.com'],status:'approved-discovery'},
 {id:'jost',publisher:'JOST',tier:1,kinds:['fifth-wheel','landing-gear','coupling','parts'],domains:['jostinternational.com'],status:'approved-discovery'},
 {id:'donaldson',publisher:'Donaldson',tier:1,kinds:['filtration','air','fuel','oil','coolant'],domains:['donaldson.com'],status:'approved-discovery'},
 {id:'fleetguard',publisher:'Fleetguard / Atmus',tier:1,kinds:['filtration','air','fuel','oil','coolant'],domains:['fleetguard.com','atmus.com'],status:'approved-discovery'},
 {id:'trucklite',publisher:'Truck-Lite',tier:1,kinds:['lighting','electrical'],domains:['truck-lite.com'],status:'approved-discovery'},
 {id:'grote',publisher:'Grote Industries',tier:1,kinds:['lighting','electrical'],domains:['grote.com'],status:'approved-discovery'},
 {id:'nhtsa',publisher:'NHTSA',tier:1,kinds:['recall','safety','vehicle','regulatory'],domains:['nhtsa.gov'],status:'approved-discovery'},
 {id:'epa',publisher:'U.S. EPA',tier:1,kinds:['emissions','aftertreatment','regulatory'],domains:['epa.gov'],status:'approved-discovery'},
 {id:'automann',publisher:'Automann',tier:3,kinds:['aftermarket-parts','cross-reference','catalog','technical-resource'],domains:['automann.com'],status:'approved-discovery',note:'Useful aftermarket discovery source. Competitive cross/application claims do not outrank OEM/manufacturer evidence.'}
];
function byKind(kind){kind=String(kind||'').toLowerCase();return sources.filter(s=>s.kinds.some(k=>k.includes(kind)||kind.includes(k)))}
function byDomain(host){host=String(host||'').toLowerCase().replace(/^www\./,'');return sources.find(s=>s.domains.some(d=>host===d||host.endsWith('.'+d)))||null}
function allowed(url){try{const u=new URL(url);const s=byDomain(u.hostname);return{registered:!!s,source:s,stillMustCheck:['robots.txt','terms/licensing','rate limits','public accessibility','copyright/use limits']}}catch(e){return{registered:false,source:null,error:'invalid URL'}}}
window.TFHResearchSources={sources,byKind,byDomain,allowed,policy:'Registry controls where TruckFixHub research may begin. It never grants permission to bypass technical or legal access controls, and it never verifies a claim by itself.'};
})();