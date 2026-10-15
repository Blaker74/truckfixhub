import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { repairGuides, publicFiles, resourceDestination } from '../rebuild-assets/road-resources.mjs';
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const base = 'https://truckfixhub.com/';
test('all advertised repair guides and tools exist with public, canonical pages', () => {
 assert.equal(repairGuides.length, 4);
 for (const file of publicFiles) {
  assert(existsSync(new URL('../' + file, import.meta.url)));
  const html = read(file);
  assert.match(html, new RegExp('https://truckfixhub.com/' + file.replaceAll('.', '\\.')));
  assert.match(html, /<h1>/);
  assert.doesNotMatch(html, /content="noindex/);
 }
 const home = read('index.html');
 for (const file of ['resources.html','truck-repair-shop-directory.html','trip-fuel-cost-calculator.html']) assert(home.includes('href="'+file+'"'));
});
test('reading-frame navigation preserves the book and opens manufacturer sites separately', () => {
 assert.deepEqual(resourceDestination(base+'dd13-dd15-oil-suction-manifold.html', base), {kind:'resource',file:'dd13-dd15-oil-suction-manifold.html',hash:''});
 assert.deepEqual(resourceDestination(base+'#contents', base), {kind:'chapter',id:'contents'});
 assert.deepEqual(resourceDestination(base+'#community', base), {kind:'chapter',id:'community'});
 assert.deepEqual(resourceDestination(base+'?view=forum', base), {kind:'chapter',id:'community'});
 assert.deepEqual(resourceDestination('https://www.cummins.com/', base), {kind:'external'});
 assert.deepEqual(resourceDestination('tel:+15734717100', base), {kind:'device'});
 assert.deepEqual(resourceDestination(base+'tools.html?view=trucks', base), {kind:'external'});
});
test('fuel calculator returns correct one-way and round-trip totals and rejects invalid input', () => {
 const html=read('trip-fuel-cost-calculator.html');
 const script=html.match(/<script>(document.getElementById\('fuel-form'\)[\s\S]*?)<\/script>/)[1];
 let submit;
 const elements={ 'fuel-form': {addEventListener: (_, callback)=>{submit=callback;}, reportValidity:()=>true}, distance:{value:'400'}, mpg:{value:'8'}, price:{value:'4'}, journey:{value:'1'}, result:{textContent:''}, breakdown:{textContent:''} };
 runInNewContext(script, {document:{getElementById: id=>elements[id]}});
 submit.call(elements['fuel-form'], {preventDefault(){}});
 assert.equal(elements.result.textContent,'$200.00 estimated fuel cost');
 assert.match(elements.breakdown.textContent,/50 gallons/);
 elements.journey.value='2'; submit.call(elements['fuel-form'], {preventDefault(){}});
 assert.equal(elements.result.textContent,'$400.00 estimated fuel cost');
 elements.result.textContent='unchanged';elements.mpg.value='0';submit.call(elements['fuel-form'], {preventDefault(){}});
 assert.equal(elements.result.textContent,'unchanged');
});
test('shop search filters listings by all search terms and reports empty results', () => {
 const script=read('truck-repair-shop-directory.html').match(/<script>(const search=document.getElementById\('shop-search'\)[\s\S]*?)<\/script>/)[1];
 let searchInput;
 const elements={ 'shop-search':{value:'',addEventListener:(_, fn)=>{searchInput=fn;}}, 'result-count':{}, 'no-results':{} };
 const shops=[{dataset:{search:'sikeston freightliner parts service'},hidden:false},{dataset:{search:'charleston mobile repair'},hidden:false}];
 runInNewContext(script,{document:{getElementById:id=>elements[id],querySelectorAll:()=>shops}});
 elements['shop-search'].value='sikeston parts';searchInput();
 assert.equal(shops[0].hidden,false);assert.equal(shops[1].hidden,true);assert.equal(elements['result-count'].textContent,'1 local listing');
 elements['shop-search'].value='no such shop';searchInput();assert.equal(elements['no-results'].hidden,false);
});
