/* TruckFixHub Repair Intelligence Auditor v1
   Safety and integrity rules stay above learned diagnostic patterns. */
(function(){
'use strict';
const CRITICAL=[
 {name:'braking / air system',re:/brake|air pressure|parking brake|hot wheel|wheel end|slack adjuster/i},
 {name:'steering system',re:/steer|steering|tie rod|drag link/i},
 {name:'fire / electrical hazard',re:/fire|smoke|burning|melted wire|short circuit/i},
 {name:'overheat / pressure hazard',re:/overheat|boiling coolant|coolant pressure|high temperature/i}
];
function text(j){return [j.engine,j.fault_code,j.system_problem,j.symptoms,j.recent_context,j.safety_status].filter(Boolean).join(' ')}
function audit(job,ranked){const t=text(job),flags=[],questions=[];for(const c of CRITICAL)if(c.re.test(t))flags.push('Safety-critical evidence involves the '+c.name+'. Do not operate the vehicle if safe operation is in question.');if(!job.engine)questions.push('engine or powertrain identification');if(!job.symptoms)questions.push('exact symptoms and operating conditions');if(!job.fault_code)questions.push('active fault codes/SPN-FMI if available');if(!job.recent_context)questions.push('recent repairs, parts changes or events');if(!ranked||!ranked.length)flags.push('Evidence is insufficient to rank a diagnostic direction reliably.');const top=ranked&&ranked[0];if(top&&top.score<7)flags.push('Current evidence is weak. More testing is required before relying on the leading possibility.');return {passed:!flags.some(x=>x.startsWith('Safety-critical')),flags,questions,rule:'Safety → Integrity → Evidence → Diagnostic Reasoning → Learning → Optimization'}}
function render(job,ranked,target){const a=audit(job,ranked),el=typeof target==='string'?document.getElementById(target):target;if(!el)return a;el.innerHTML='<div style="padding:14px;border:2px solid '+(a.passed?'#315e8a':'#9b2929')+';border-radius:12px;background:#fff"><b>🛡️ Intelligence Audit</b><p class="small">'+esc(a.rule)+'</p>'+(a.flags.length?'<b>Audit findings:</b><ul>'+a.flags.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p>✓ No immediate safety/integrity conflict detected in the available evidence.</p>')+(a.questions.length?'<b>Evidence that would improve this diagnosis:</b><ul>'+a.questions.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+'<p class="small">The auditor challenges the ranking; it does not confirm a diagnosis.</p></div>';return a}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.TFHRepairAuditor={audit,render};
})();