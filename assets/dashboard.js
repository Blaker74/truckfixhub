(() => {
'use strict';
const $=id=>document.getElementById(id);
function node(tag,text,className){const element=document.createElement(tag);if(text!==undefined)element.textContent=text;if(className)element.className=className;return element;}
const tfhAppPages=[
 {title:'Calls & Contacts',apps:[['🎙️','Call Notes','Private requests, transcripts & voice memos','?view=call-notes'],['📞','My Contacts','Private customer & coworker contacts','?view=my-contacts']]},
 {title:'Parts & Trucks',apps:[['🧰','Parts Counter','Part numbers, inventory & scratchpad','?view=parts'],['🚛','Fleet VIN List','Private truck numbers & VINs','?view=trucks']]},
 {title:'Repair Resources',apps:[['🔧','Garage','Repair tools & community help','?view=garage'],['📍','Shop Directory','Find truck repair shops','?view=shops']]},
 {title:'Customers & Cards',apps:[['👥','My Customer List','Your private customer records','?view=customers'],['💼','Business Card Wallet','Keep your business cards together','?view=wallet']]},
 {title:'Workday Tools',apps:[['📅','Calendar & Clock','Plan your day & check the time','?view=calendar'],['📄','Sales Flyers','Save and find monthly specials','?view=sales-flyers']]},
 {title:'Documents & Light',apps:[['🗂️','Personal Documents','Private photos & paperwork','?view=personal-documents'],['🔦','Flashlight','Bright screen work light','?view=flashlight']]},
 {title:'Fuel & Food',apps:[['⛽','Fuel Station','Nationwide truck-stop resources','?view=fuel-islands'],['🍽️','Diner','Places for truck drivers to eat','?view=restaurant']]},
 {title:'Take a Break',apps:[['🎰','Casino','Slot machine with free play credits','?view=casino'],['🏈','Sports','NFL, MLB & NHL scores and highlights','?view=sports']]},
 {title:'Read & Listen',apps:[['📚','Library','Read a book in the library','?view=library'],['🎧','Audiobooks','Free classics, chapters & resume playback','?view=audiobooks']]},
 {title:'Books & Resources',apps:[['🎵','Blake’s Books & Music','Stories & songs from Blake Pierce','?view=books-music'],['🌐','Supermiller','Visit the Supermiller resource','?view=supermiller']]},
 {title:'Links & Owner',apps:[['🔗','Quick Links','Your saved website shortcuts','?view=quick-links'],['✉️','Contact Site Owner','Questions, feedback & sponsorship','?view=owner-contact']]},
 {title:'TruckFixHub Gear',shopOnly:true,apps:[['👕','Shop TruckFixHub Gear','Open our official gear shop in a new tab','https://truckfixhub-gear-shop.fourthwall.com/']]}
];
// Dashboard directory: local favorites store tool IDs only, never account data.
const hubWorkViews=new Set(['call-notes','my-contacts','parts','trucks','customers','wallet','sales-flyers','personal-documents','quick-links']);
const hubRoadViews=new Set(['garage','shops','fuel-islands','restaurant','flashlight']);
const hubTools=[{icon:'◎',title:'Community',description:'Posts, photos, videos & real trucking conversations',url:'community.html',category:'road',private:false},
 ...tfhAppPages.flatMap(group=>group.apps.map(([icon,title,description,url])=>{const view=new URLSearchParams(url.split('?')[1]||'').get('view');return {icon,title,description,url,category:hubWorkViews.has(view)||view==='calendar'?'work':hubRoadViews.has(view)||view==='supermiller'?'road':'break',private:hubWorkViews.has(view)};})),
 {icon:'↔',title:'Trip Fuel Calculator',description:'Estimate fuel gallons, total cost & cost per mile',url:'trip-fuel-cost-calculator.html',category:'road',private:false},
 {icon:'▤',title:'Repair Guides',description:'Emissions, electronics, Detroit & Cummins resources',url:'resources.html',category:'road',private:false}];
let hubFilter='all',hubFavorites=new Set();
try{const saved=JSON.parse(localStorage.getItem('tfh.tool-favorites')||'[]');if(Array.isArray(saved))hubFavorites=new Set(saved.filter(v=>typeof v==='string'&&hubTools.some(t=>t.url===v)));}catch{}
function tfhRenderDirectory(){
 const grid=$('tfh-paged-apps');grid.replaceChildren();
 const query=$('hub-search').value.trim().toLocaleLowerCase();
 const visible=hubTools.filter(t=>(hubFilter==='all'||hubFilter==='saved'&&hubFavorites.has(t.url)||t.category===hubFilter)&&(!query||(t.title+' '+t.description).toLocaleLowerCase().includes(query)));
 for(const tool of visible){
  const card=node('article',undefined,'hub-tool-card'),link=node('a',undefined,'hub-tool-link');link.href=tool.url.startsWith('?')?'index.html'+tool.url:tool.url;
  const top=node('div',undefined,'hub-tool-top');top.append(node('span',tool.icon,'hub-tool-icon'));if(tool.private)top.append(node('span','PRIVATE','hub-tool-badge'));
  link.append(top,node('h3',tool.title),node('p',tool.description),node('span',tool.url.startsWith('https:')?'Open website ↗':'Open tool →','hub-tool-open'));
  if(tool.url.startsWith('https:')){link.target='_blank';link.rel='noopener noreferrer';}
  const favorite=node('button',hubFavorites.has(tool.url)?'★':'☆','hub-favorite');favorite.type='button';favorite.setAttribute('aria-label','Favorite '+tool.title);favorite.setAttribute('aria-pressed',String(hubFavorites.has(tool.url)));
  favorite.onclick=()=>{const index=visible.indexOf(tool);if(hubFavorites.has(tool.url))hubFavorites.delete(tool.url);else hubFavorites.add(tool.url);try{localStorage.setItem('tfh.tool-favorites',JSON.stringify([...hubFavorites]));}catch{}tfhRenderDirectory();const buttons=grid.querySelectorAll('.hub-favorite');if(buttons.length)buttons[Math.min(index,buttons.length-1)].focus({preventScroll:true});else $('hub-search').focus({preventScroll:true});};
  card.append(link,favorite);grid.append(card);
 }
 $('hub-results').textContent=visible.length+' '+(visible.length===1?'tool':'tools')+(query?' matching “'+$('hub-search').value.trim()+'”':'')+(hubFilter==='saved'?' in your favorites':'');
 if(!visible.length){const empty=node('div',undefined,'hub-empty');empty.append(node('h3',hubFilter==='saved'&&!query?'Keep your go-to tools here.':'No tools found.'),node('p',hubFilter==='saved'&&!query?'Tap the star on any tool to add it to your favorites.':'Try another search or choose All tools.'));grid.append(empty);}
}
$('hub-search').oninput=tfhRenderDirectory;
document.querySelectorAll('[data-hub-filter]').forEach(button=>button.onclick=()=>{hubFilter=button.dataset.hubFilter;document.querySelectorAll('[data-hub-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));tfhRenderDirectory();});


tfhRenderDirectory();
})();
