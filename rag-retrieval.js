(()=>{
const STOP=new Set('a an and are as at be but by for from had has have he her his i if in into is it its me my of on or our she so that the their them then there they this to truck was we were what when where which who why will with you your'.split(' '));
const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const terms=s=>norm(s).split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
const uniq=a=>[...new Set(a)];
function exactTokens(s){return new Set(terms(s))}
function score(doc,q){
  const qt=uniq(terms(q)),title=norm(doc.title),tags=norm((doc.tags||[]).join(' ')),summary=norm(doc.summary),all=title+' '+tags+' '+summary;
  const titleTokens=exactTokens(doc.title),tagTokens=exactTokens((doc.tags||[]).join(' ')),summaryTokens=exactTokens(doc.summary);
  let n=0,matched=0;
  for(const t of qt){
    let hit=false;
    if(tagTokens.has(t)){n+=7;hit=true}
    if(titleTokens.has(t)){n+=6;hit=true}
    if(summaryTokens.has(t)){n+=3;hit=true}
    if(!hit&&all.includes(t)){n+=1;hit=true}
    if(hit)matched++;
  }
  const phrase=norm(q);
  if(phrase&&phrase.length>4&&all.includes(phrase))n+=15;
  const coverage=qt.length?matched/qt.length:0;
  if(coverage>=.75)n+=8;else if(coverage>=.5)n+=4;
  return {score:n,coverage,matched,total:qt.length};
}
async function load(){const r=await fetch('rag-knowledge.json',{cache:'no-cache'});if(!r.ok)throw new Error('Knowledge index unavailable');return r.json()}
async function retrieve(q,limit=4){
  const db=await load();
  return db.documents.map(d=>{const s=score(d,q);return {...d,_score:s.score,_coverage:s.coverage,_matched:s.matched,_queryTerms:s.total}})
    .filter(d=>d._score>=4)
    .sort((a,b)=>b._score-a._score||b._coverage-a._coverage)
    .slice(0,limit);
}
window.TruckFixHubRAG={retrieve};
})();