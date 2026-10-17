(()=>{
const STOP=new Set('a an and are as at be but by for from had has have he her his i if in into is it its me my of on or our she so that the their them then there they this to truck was we were what when where which who why will with you your'.split(' '));
const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const terms=s=>norm(s).split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
function score(doc,q){const qt=terms(q),title=norm(doc.title),tags=norm((doc.tags||[]).join(' ')),summary=norm(doc.summary),all=title+' '+tags+' '+summary;let n=0;for(const t of qt){if(tags.includes(t))n+=5;if(title.includes(t))n+=4;if(summary.includes(t))n+=2;if(all.includes(t))n+=1}const phrase=norm(q);if(phrase&&all.includes(phrase))n+=12;return n}
async function load(){const r=await fetch('rag-knowledge.json',{cache:'no-cache'});if(!r.ok)throw new Error('Knowledge index unavailable');return r.json()}
async function retrieve(q,limit=4){const db=await load();return db.documents.map(d=>({...d,_score:score(d,q)})).filter(d=>d._score>0).sort((a,b)=>b._score-a._score).slice(0,limit)}
window.TruckFixHubRAG={retrieve};
})();