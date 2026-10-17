/* TruckFixHub Eaton/Fuller Cross-Reference Seed v1
   Source: Eaton Fuller Subassemblies public model listings (APSL0148).
   These records establish authoritative part-to-model relationships, not universal interchangeability.
*/
(function(){'use strict';
const source={name:'Eaton Fuller Subassemblies APSL0148',url:'https://www.eaton.com/content/dam/eaton/products/transmissions/vehicle-transmissions/transmission-parts/subassemblies/eaton-fuller-subassemblies-model-listings-apsl0148-en-us.pdf',date:'2026'};
const records=[
 {brand:'Eaton Fuller',number:'S-3055',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'FRO-14210C'},{component:'FRO-15210C'},{component:'FRO-16210C'}]},
 {brand:'Eaton Fuller',number:'S-3057',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTLO-15610B'},{component:'RTLO-16610B'},{component:'RTLO-17610B'}]},
 {brand:'Eaton Fuller',number:'S-3062',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTLO-16913A'}]},
 {brand:'Eaton Fuller',number:'S-3052',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTLO-20918B'}]},
 {brand:'Eaton Fuller',number:'S-3076',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTLO-22918B'}]},
 {brand:'Eaton Fuller',number:'S-3053',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTO-14908LL'},{component:'RTO-16908LL'}]},
 {brand:'Eaton Fuller',number:'S-3060',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTO-14915'},{component:'RTO-16915'}]},
 {brand:'Eaton Fuller',number:'S-3073',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTO-14613'}]},
 {brand:'Eaton Fuller',number:'S-3056',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTOC-18909A'},{component:'RTLO-18913A'}]},
 {brand:'Eaton Fuller',number:'S-3051',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTX-14609B'}]},
 {brand:'Eaton Fuller',number:'S-3059',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTX-16709B'}]},
 {brand:'Eaton Fuller',number:'S-3058',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTX-16710B'}]},
 {brand:'Eaton Fuller',number:'S-3054',category:'transmission-mainshaft-subassembly',description:'Mainshaft subassembly',applications:[{component:'RTX-16710C'}]},
 {brand:'Eaton Fuller',number:'S-3026',category:'transmission-countershaft-subassembly',description:'Upper countershaft subassembly',applications:[{component:'FRO-15210C'},{component:'FRO-16210C'}]},
 {brand:'Eaton Fuller',number:'S-3027',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly - internal cooler application',applications:[{component:'FRO-15210C'},{component:'FRO-16210C'}]},
 {brand:'Eaton Fuller',number:'S-3028',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly - internal pump application',applications:[{component:'FRO-15210C'},{component:'FRO-16210C'}]},
 {brand:'Eaton Fuller',number:'S-3063',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly',applications:[{component:'RTLO-16913A'}]},
 {brand:'Eaton Fuller',number:'S-3064',category:'transmission-countershaft-subassembly',description:'Upper countershaft subassembly',applications:[{component:'RTLO-16913A'}]},
 {brand:'Eaton Fuller',number:'S-3029',category:'transmission-countershaft-subassembly',description:'Upper countershaft subassembly',applications:[{component:'RTLO-18718B'}]},
 {brand:'Eaton Fuller',number:'S-3030',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly',applications:[{component:'RTLO-18718B'}]},
 {brand:'Eaton Fuller',number:'S-3065',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly',applications:[{component:'RTLO-18913A'}]},
 {brand:'Eaton Fuller',number:'S-3066',category:'transmission-countershaft-subassembly',description:'Upper countershaft subassembly',applications:[{component:'RTLO-18913A'}]},
 {brand:'Eaton Fuller',number:'S-3039',category:'transmission-countershaft-subassembly',description:'Upper countershaft subassembly',applications:[{component:'RTLO-20918B'}]},
 {brand:'Eaton Fuller',number:'S-3040',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly',applications:[{component:'RTLO-20918B'}]},
 {brand:'Eaton Fuller',number:'S-3097',category:'transmission-countershaft-subassembly',description:'Upper countershaft subassembly',applications:[{component:'RTLO-22918B'}]},
 {brand:'Eaton Fuller',number:'S-3098',category:'transmission-countershaft-subassembly',description:'Lower countershaft subassembly',applications:[{component:'RTLO-22918B'}]}
].map(r=>({...r,sourceTier:1,status:'verified',sources:[source],attributes:{authority:'manufacturer-public-model-listing',verifyExactModel:true}}));
function load(){if(!window.TFHPartsCrossReference)return 0;return window.TFHPartsCrossReference.ingestMany(records)}
window.TFHEatonPartsData={records,load,source,policy:'Use exact model and serial/specification data. A listed model relationship does not authorize extrapolation to similar model numbers.'};
if(window.TFHPartsCrossReference)load();
})();