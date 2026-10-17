/* TruckFixHub Parts Identification Brain v1
   Inspired by useful heavy-duty catalog workflows, but implemented as TruckFixHub's own logic/data model.
   Goal: accept whatever evidence the user has and route toward an independently verified component identity.
*/
(function(){'use strict';
const PATHS={
 PART_NUMBER:{label:'Part number / cross reference',needs:['number']},
 APPLICATION:{label:'Year / make / model',needs:['year','make','model']},
 POWERTRAIN:{label:'Engine / transmission / axle model',needs:['componentModel']},
 CATEGORY:{label:'Category / component description',needs:['category']},
 DIMENSIONS:{label:'Measurements / physical attributes',needs:['dimensions']},
 SCHEMATIC:{label:'Schematic / callout',needs:['schematic','callout']},
 BARCODE:{label:'Barcode / scanned identifier',needs:['barcode']},
 SYMPTOM:{label:'Diagnostic symptom',needs:['symptom']}
};
const CATEGORY_FAMILIES={
 'air-brake-wheel':['bearings','brake drums','brake shoes','camshafts','disc pads','rotors','hubs','hub caps','oil seals','slack adjusters','wheel studs','wheel nuts'],
 'air-springs-shocks':['air springs','cab air springs','seat air springs','shocks','seat valves','steering stabilizers'],
 'cooling-charge-air':['belts','tensioners','charge air coolers','CAC hoses','clamps','coolant sensors','radiators','thermostats','water pumps'],
 electrical:['switches','sensors','fuses','junction boxes','cables','connectors','rotating electrical','trailer cords'],
 lighting:['headlamps','marker lights','stop tail turn','work lamps','trailer lights','pigtails','harnesses'],
 suspension:['leaf springs','bushings','radius rods','torque rods','spring hardware','trailer suspension'],
 trailer:['fifth wheel','kingpin','landing gear','door hardware','trailer brake','trailer lighting'],
 powertrain:['engine','clutch','transmission','driveline','PTO','differential','axle','wheel end'],
 filtration:['air filter','fuel filter','fuel water separator','oil filter','coolant filter','hydraulic filter']
};
function clean(v){return String(v||'').trim()}
function availablePaths(e={}){const p=[];if(clean(e.number)||clean(e.partNumber))p.push('PART_NUMBER');if(e.year&&e.make&&e.model)p.push('APPLICATION');if(clean(e.componentModel)||clean(e.engine)||clean(e.transmission)||clean(e.axle))p.push('POWERTRAIN');if(clean(e.category)||clean(e.description))p.push('CATEGORY');if(e.dimensions&&Object.keys(e.dimensions).length)p.push('DIMENSIONS');if(e.schematic&&e.callout)p.push('SCHEMATIC');if(clean(e.barcode))p.push('BARCODE');if(clean(e.symptom)||clean(e.systemProblem))p.push('SYMPTOM');return p}
function evidenceStrength(e={}){let score=0;const why=[];if(e.partNumber||e.number){score+=25;why.push('part number supplied')}if(e.componentModel||e.engineSerial||e.transmissionSerial){score+=22;why.push('component identity supplied')}if(e.vin){score+=18;why.push('VIN supplied')}if(e.year&&e.make&&e.model){score+=15;why.push('vehicle application supplied')}if(e.dimensions&&Object.keys(e.dimensions).length>=2){score+=12;why.push('multiple measurements supplied')}if(e.schematic&&e.callout){score+=12;why.push('schematic callout supplied')}if(e.photo){score+=5;why.push('photo available for identification support')}if(e.symptom){score+=4;why.push('symptom supplied; diagnostic evidence only')}return{score:Math.min(score,100),why}}
function nextQuestions(e={}){const q=[];if(!e.partNumber&&!e.number)q.push('Do you have any number stamped, printed or labeled on the old part?');if(!e.vin&&!(e.year&&e.make&&e.model))q.push('What truck/trailer year, make and model is this on?');if(!e.componentModel&&!e.engine&&!e.transmission&&!e.axle)q.push('What engine, transmission, axle or component model is involved?');if(!e.engineSerial&&!e.transmissionSerial&&!e.componentSerial)q.push('Is a serial/specification number available from the component tag?');if(!e.dimensions)q.push('If the number is missing, can key dimensions or mounting details be measured?');return q.slice(0,4)}
function identify(e={}){const paths=availablePaths(e),strength=evidenceStrength(e),cross=window.TFHPartsCrossReference;let numberMatches=[],componentRecognition=null;if(cross){const n=e.partNumber||e.number||e.barcode;if(n)numberMatches=cross.crossReference(n,{brand:e.brand,category:e.category,application:e.componentModel||e.engine||e.model});const cm=e.componentModel||e.transmission;if(cm&&cross.recognizeComponentModel)componentRecognition=cross.recognizeComponentModel(cm)}return{paths,labels:paths.map(x=>PATHS[x].label),strength,numberMatches,componentRecognition,nextQuestions:nextQuestions(e),policy:'Start with whatever evidence exists, then converge. Never infer fit solely from visual similarity, number similarity, popularity, distributor availability, or a schematic callout. Verify current manufacturer/OEM application and specifications before ordering or installation.'}}
window.TFHPartsIdentification={PATHS,CATEGORY_FAMILIES,availablePaths,evidenceStrength,nextQuestions,identify};
})();