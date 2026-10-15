import test from 'node:test';
import assert from 'node:assert/strict';
import {installCallNoteDelete} from '../rebuild-assets/call-note-delete.mjs';
function setup(){
 let listener,calls=0;
 const elements=[];
 function element(){const el={textContent:'',disabled:false,isConnected:true,children:[],setAttribute(){},append(...els){this.children.push(...els);for(const e of els)e.parentNode=this;},remove(){this.isConnected=false;},scrollIntoView(){},focus(){},closest(){return this;}};elements.push(el);return el;}
 const original=()=>{throw Error('Native confirm must not open');};const win={confirm:original};
 const list={dataset:{},contains:()=>true,addEventListener:(type,fn)=>listener=fn};
 const doc={defaultView:win,getElementById:id=>id==='cn-list'?list:{textContent:'Permission denied'},createElement:element};
 const button=element();button.textContent='Delete';button.onclick=()=>{assert.equal(win.confirm('Permanently delete this request and its audio?'),true);calls++;return Promise.resolve();};const parent=element();parent.append(button);
 installCallNoteDelete(doc);
 return {button,parent,win,original,doc,elements,calls:()=>calls,click(){listener({target:button,preventDefault(){},stopImmediatePropagation(){}});}};
}
test('embedded delete shows inline choice and cancel never calls the delete handler',()=>{const s=setup();s.click();assert.equal(s.calls(),0);s.elements.find(e=>e.textContent==='Keep note').onclick();assert.equal(s.button.disabled,false);assert.equal(s.calls(),0);});
test('explicit confirmation calls existing handler and immediately restores native confirm',async()=>{const s=setup();s.click();const pending=s.elements.find(e=>e.textContent==='Delete permanently').onclick();assert.equal(s.win.confirm,s.original);await pending;assert.equal(s.calls(),1);});
test('failed deletion displays existing inbox error beside the affected note',async()=>{const s=setup();s.click();await s.elements.find(e=>e.textContent==='Delete permanently').onclick();assert(s.elements.some(e=>e.textContent==='Permission denied'));});
test('stale disconnected notes cannot be deleted',async()=>{const s=setup();s.click();s.button.isConnected=false;await s.elements.find(e=>e.textContent==='Delete permanently').onclick();assert.equal(s.calls(),0);});
test('repeated tap cannot create duplicate confirmation prompts',()=>{const s=setup();s.click();s.click();assert.equal(s.elements.filter(e=>e.textContent==='Keep note').length,1);});
