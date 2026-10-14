import {calculateCosts} from './trucking-costs.mjs';
const $=id=>document.getElementById(id),money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
function calculate(e){e?.preventDefault();if(!$('cost-form').reportValidity())return;try{
 const ids=['loaded','empty','mpg','diesel','maintenance','pay','other','fixed','margin','rate'];const args=Object.fromEntries(ids.map(id=>[id,$(id).valueAsNumber]));const r=calculateCosts(args);
 $('cost-result').textContent=money(r.breakEven)+' per loaded mile to break even';
 $('total-cost').textContent=money(r.cost);$('cost-mile').textContent=money(r.perMile);$('target-rate').textContent=money(r.target);$('estimated-revenue').textContent=money(r.revenue);$('operating-result').textContent=money(r.result);$('fuel-total').textContent=money(r.fuel);
 $('result-context').textContent=`For ${r.miles.toLocaleString('en-US')} total miles, including ${args.empty.toLocaleString('en-US')} empty miles (${r.emptyPercent.toFixed(1)}%). At your entered loaded-mile rate, the estimated operating ${r.result<0?'shortfall':'surplus'} is ${money(Math.abs(r.result))}, after the driver compensation and costs entered. The target rate uses your ${args.margin}% margin on revenue.`;
 $('results').hidden=false;$('cost-error').textContent='';
}catch(err){$('cost-error').textContent=err.message;$('results').hidden=true;}}
$('cost-form').addEventListener('submit',calculate);
