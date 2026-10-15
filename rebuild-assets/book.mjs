import { chapters, CONTENTS_PER_PAGE, readPage, remainingSeconds } from './book-data.mjs';
const $ = id => document.getElementById(id);
const handbook = $('handbook'), splash = $('truck-entry'), start = $('start-engine'), stage = $('engine-stage'), canvas = $('engine-smoke'), status = $('engine-status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let running = false, leaving = false, frame = 0, timer = 0, countdownTimer = 0, audioContext = null, source = null, master = null;
let opened = false, current = readPage(location.hash), activeFrame = null, frameTimeout = 0;
const drawings = {
 community: '<rect x="15" y="12" width="100" height="65" rx="14" fill="#fff" stroke="#204e7b" stroke-width="4"/><path d="M36 77v18l22-18" fill="#fff" stroke="#204e7b" stroke-width="4"/><circle cx="41" cy="42" r="8" fill="#4383bb"/><circle cx="65" cy="42" r="8" fill="#4383bb"/><circle cx="89" cy="42" r="8" fill="#4383bb"/>',
 truck: '<rect x="12" y="28" width="63" height="48" rx="5" fill="#bdcddd" stroke="#204e7b" stroke-width="4"/><path d="M75 41h24l18 20v15H75Z" fill="#4383bb" stroke="#204e7b" stroke-width="4"/><path d="M81 46h15l10 13H81Z" fill="#e8f4ff"/><circle cx="34" cy="78" r="10" fill="#173753"/><circle cx="97" cy="78" r="10" fill="#173753"/><path d="M22 41h41M22 52h41M22 63h24" stroke="#fff" stroke-width="4"/>',
 parts: '<rect x="15" y="56" width="100" height="30" rx="6" fill="#4383bb" stroke="#204e7b" stroke-width="4"/><path d="M32 56V23h23v33M70 56l26-36 12 9-19 27M15 69h100" fill="#c8d6e4" stroke="#204e7b" stroke-width="4"/><circle cx="47" cy="35" r="4" fill="#204e7b"/>',
 road: '<path d="M45 10h40l32 90H13Z" fill="#204e7b"/><path d="M65 16v15m0 12v19m0 14v20" stroke="#fff" stroke-width="5"/><path d="M14 46h25M90 46h25" stroke="#4383bb" stroke-width="7"/><circle cx="18" cy="24" r="12" fill="#b4cde2"/><circle cx="112" cy="24" r="12" fill="#b4cde2"/>',
 work: '<rect x="24" y="17" width="82" height="78" rx="7" fill="#fff" stroke="#204e7b" stroke-width="4"/><rect x="44" y="9" width="42" height="17" rx="5" fill="#4383bb"/><path d="m36 43 6 6 9-12M59 43h32m-55 21 6 6 9-12M59 64h32m-55 20h55" fill="none" stroke="#4383bb" stroke-width="4"/>',
 gear: '<path d="m44 15-29 20 14 23 14-7v45h44V51l14 7 14-23-29-20c-5 20-37 20-42 0Z" fill="#c8d6e4" stroke="#204e7b" stroke-width="4"/><path d="M49 51h32v24H49Z" fill="#204e7b"/><text x="65" y="68" fill="white" font-family="system-ui" font-size="13" font-weight="800" text-anchor="middle">TFH</text>'
};
function art(name) { return '<svg viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + drawings[name] + '</svg>'; }
function node(tag, text, cls) { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (cls) el.className = cls; return el; }
function stopEngine() {
 cancelAnimationFrame(frame); clearTimeout(timer); clearInterval(countdownTimer);
 if (source) { try { source.stop(); } catch {} source = null; }
 if (audioContext) { audioContext.close().catch(() => {}); audioContext = null; }
}
function enterBook() {
 if (leaving) return; leaving = true; stopEngine();
 handbook.hidden = false; handbook.inert = false; opened = true;
 if (!location.hash) history.replaceState(null, '', '#contents');
 render(); splash.classList.add('leaving');
 setTimeout(() => { splash.hidden = true; $('contents-title').focus({ preventScroll: true }); if (current.kind === 'chapter') $('chapter-title').focus({ preventScroll: true }); }, reduced ? 0 : 650);
}
function playDiesel(){
 try{
  const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)throw Error('Audio unavailable');
  audioContext=new AudioCtor();audioContext.resume().catch(()=>{status.textContent='Engine animation playing — sound unavailable';});
  const rate=audioContext.sampleRate,duration=10,buffer=audioContext.createBuffer(1,Math.ceil(rate*duration),rate),data=buffer.getChannelData(0);
  let phase=0,lowNoise=0;
  for(let i=0;i<data.length;i++){
   const t=i/rate,catching=t>=1.15;
   const rpm=catching?Math.max(650,1020-(t-1.15)*180):155+25*Math.sin(t*12);
   const firing=rpm/60*3;phase+=firing/rate;
   const noise=Math.random()*2-1;lowNoise=.86*lowNoise+.14*noise;
   const beat=phase%1,pulse=Math.exp(-beat*18);
   const growl=Math.sin(phase*2*Math.PI)+.4*Math.sin(phase*4*Math.PI)+.16*Math.sin(phase*8*Math.PI);
   const crank=(Math.sin(t*2*Math.PI*185)+.45*noise)*(.55+.45*Math.sin(phase*2*Math.PI));
   const level=Math.min(1,t/.08)*Math.min(1,(duration-t)/.7);
   data[i]=level*(catching?(.24*growl+.38*lowNoise*(.35+pulse)+.11*pulse*noise):.20*crank);
  }
  source=audioContext.createBufferSource();source.buffer=buffer;
  const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1800;
  master=audioContext.createGain();master.gain.value=.7;source.connect(filter);filter.connect(master);master.connect(audioContext.destination);source.start();
 }catch(e){status.textContent='Engine animation playing — sound unavailable';}
}
function smoke(){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const dpr=Math.min(devicePixelRatio||1,2),w=600,h=433;
 canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
 const puffs=[],began=performance.now();let previous=began,lastPuff=began;
 function draw(now){
  if(leaving)return;const dt=Math.min((now-previous)/1000,.05);previous=now;
  const elapsed=(now-began)/1000;
  // Original 1536x1024 logo: stack outlets near x=31.5% and 68.5%, y=3%.
  const outlets=[{x:(.1+.315)/1.2*w,y:(.3+.03)/1.3*h},{x:(.1+.685)/1.2*w,y:(.3+.03)/1.3*h}];
  if(elapsed>1.15&&now-lastPuff>95){lastPuff=now;outlets.forEach(o=>puffs.push({x:o.x,y:o.y,r:4,age:0,vx:(Math.random()-.5)*8,vy:25+Math.random()*15}));}
  ctx.clearRect(0,0,w,h);
  for(let i=puffs.length-1;i>=0;i--){
   const p=puffs[i];p.age+=dt;p.y-=p.vy*dt;p.x+=(p.vx+9*p.age)*dt;p.r+=12*dt;
   if(p.age>2.5){puffs.splice(i,1);continue;}
   const opacity=.42*Math.sin(Math.PI*Math.min(p.age/2.5,1));
   const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,'rgba(180,190,202,'+opacity+')');g.addColorStop(.5,'rgba(142,155,171,'+opacity*.65+')');g.addColorStop(1,'rgba(130,145,163,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  frame=requestAnimationFrame(draw);
 }
 frame=requestAnimationFrame(draw);
}
start.addEventListener('click', () => {
 if (running || leaving) return;
 running = true; start.disabled = true; start.textContent = 'Engine Running';
 const deadline = performance.now() + 10000;
 status.textContent = 'Opening the foyer in 10 seconds…';
 countdownTimer = setInterval(() => { const seconds = remainingSeconds(deadline, performance.now()); status.textContent = seconds ? 'Opening the foyer in ' + seconds + (seconds === 1 ? ' second…' : ' seconds…') : 'Opening your handbook…'; }, 250);
 if ($('engine-sound').checked) playDiesel();
 if (!reduced) { stage.classList.add('running'); smoke(); }
 timer = setTimeout(enterBook, 10000);
});
$('engine-sound').addEventListener('change', () => { if (master) master.gain.value = $('engine-sound').checked ? .7 : 0; });
$('skip-engine').addEventListener('click', enterBook);
splash.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); enterBook(); } });
window.addEventListener('pagehide', stopEngine);
function closeFrame() {
 clearTimeout(frameTimeout);
 if (activeFrame) { try { activeFrame.contentWindow.document.querySelectorAll('video,audio').forEach(media => media.pause()); } catch {} activeFrame.remove(); activeFrame = null; }
}
function canLeaveChapter() {
 try {
  const busy = [...(activeFrame?.contentDocument?.querySelectorAll('form button[type="submit"]:disabled, #parts-save:disabled, #trucks-save:disabled') || [])].some(button => button.getClientRects().length > 0);
  if (busy) { $('book-note').textContent = 'Please let your save or upload finish before turning the page.'; return false; }
 } catch {}
 return true;
}
function changePage(hash) { if (canLeaveChapter()) location.hash = hash; }
handbook.addEventListener('click', event => {
 const link = event.target.closest('a[href^="#"]');
 if (link && !canLeaveChapter()) event.preventDefault();
});
function prepareFrame(iframe, view, label, line) {
 try {
  const doc = iframe.contentDocument;
  if (!doc || new URL(iframe.contentWindow.location.href).origin !== location.origin) return;
  if (!doc.getElementById('handbook-embed-style')) {
   const style = doc.createElement('style'); style.id = 'handbook-embed-style';
   style.textContent = `html,body{height:100%!important;min-height:0!important}body{display:flex!important;flex-direction:column!important;overflow:hidden!important;font-size:20px!important}body>header,.book-footer,#member-nav,.tfh-chat-next,.tfh-social-top,.tfh-neon-control{display:none!important}#book{width:100%!important;max-width:none!important;flex:1!important;min-height:0!important;margin:0!important;border:0!important;border-radius:0!important}.book-page{padding:18px!important}.book-page h1{font-size:28px!important}.book-page h2{font-size:25px!important}.book-page h3{font-size:23px!important}.book-page p,.book-page label,.book-page input,.book-page textarea,.book-page select,.book-page button,.book-page .btn,.book-page summary,dialog p,dialog label,dialog input,dialog textarea,dialog button{font-size:19px!important;line-height:1.5!important}.book-page .small,.book-page .meta,.book-page small{font-size:16px!important}.book-page button,.book-page .btn,dialog button{min-height:48px!important}.tfh-feed-tools{margin-top:0!important}#community .tfh-composer{margin-top:0!important}a,button,input,textarea,select{touch-action:manipulation}.tfh-post-body{font-size:19px!important}`;
   doc.head.append(style);
   doc.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || event.defaultPrevented) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !/\/index\.html$|\/$/.test(url.pathname)) return;
    if (url.searchParams.get('view') === 'rooms') { event.preventDefault(); event.stopImmediatePropagation(); changePage('contents'); }
   }, true);
  }
  line.firstChild.textContent = label;
  clearTimeout(frameTimeout);
 } catch { line.firstChild.textContent = 'Use “Open full page” if this chapter does not appear.'; }
}
function openTool(view, title, privacy, back) {
 closeFrame(); const body = $('chapter-body'); body.replaceChildren();
 const line = node('div', undefined, 'tool-status'); line.append(node('span', 'Opening ' + title + '…'));
 if (back) { const button = node('button', '← Workday tools', 'tool-back'); button.type = 'button'; button.addEventListener('click', () => render()); line.append(button); }
 const full = node('a', 'Open full page ↗'); full.href = 'index.html?view=' + encodeURIComponent(view); full.target = '_blank'; full.rel = 'noopener'; line.append(full); body.append(line);
 const iframe = node('iframe'); iframe.title = title + ' — interactive TruckFixHub chapter';
 iframe.src = 'index.html?view=' + encodeURIComponent(view);
 iframe.addEventListener('load', () => { if (activeFrame === iframe) prepareFrame(iframe, view, privacy || title, line); });
 activeFrame = iframe; body.append(iframe);
 frameTimeout = setTimeout(() => { if (activeFrame === iframe) line.firstChild.textContent = 'Taking longer than usual. Try “Open full page.”'; }, 20000);
}
function render() {
 if (!opened) return;
 current = readPage(location.hash); closeFrame();
 const contents = current.kind === 'contents';
 $('contents-page').hidden = !contents; $('chapter-page').hidden = contents;
 const main = $('book-main'); main.classList.remove('page-arrive'); void main.offsetWidth; main.classList.add('page-arrive');
 if (contents) {
  const list = $('chapter-list'); list.replaceChildren();
  const startIndex = current.index * CONTENTS_PER_PAGE;
  chapters.slice(startIndex, startIndex + CONTENTS_PER_PAGE).forEach((chapter, offset) => {
   const link = node('a', undefined, 'chapter-card'); link.href = '#' + chapter.id;
   const image = node('div'); image.innerHTML = art(chapter.art); const words = node('div');
   words.append(node('small', 'CHAPTER ' + (startIndex + offset + 1)), node('h2', chapter.title), node('p', chapter.description), node('span', 'Open chapter →', 'open'));
   link.append(image, words); list.append(link);
  });
  $('contents-position').textContent = 'Contents · ' + (current.index + 1) + ' of ' + Math.ceil(chapters.length / CONTENTS_PER_PAGE) + ' · Two chapters on each page';
  $('book-note').textContent = 'Choose a chapter above, or turn to the next contents page.';
 } else {
  const chapter = chapters[current.index];
  $('chapter-number').textContent = 'CHAPTER ' + (current.index + 1) + ' OF ' + chapters.length;
  $('chapter-title').textContent = chapter.title; $('chapter-description').textContent = chapter.description;
  $('chapter-art').innerHTML = art(chapter.art);
  if (chapter.view) openTool(chapter.view, chapter.title, chapter.privacy, false);
  else {
   const body = $('chapter-body'); body.replaceChildren(); const options = node('div', undefined, 'chapter-options');
   for (const item of chapter.tools || chapter.links || []) {
    const [title, description, destination] = item;
    const option = node(chapter.tools ? 'button' : 'a', undefined, 'option-card');
    option.append(node('strong', title + (chapter.tools ? ' →' : ' ↗')), node('span', description));
    if (chapter.tools) { option.type = 'button'; option.addEventListener('click', () => openTool(destination, title, chapter.privacy, true)); }
    else { option.href = destination; if (!destination.startsWith('mailto:')) { option.target = '_blank'; option.rel = 'noopener'; } }
    options.append(option);
   }
   if (chapter.tools) { const more = node('a', undefined, 'option-card quiet-option'); more.href = 'index.html?view=rooms'; more.target = '_blank'; more.rel = 'noopener'; more.append(node('strong', 'Other original tools ↗'), node('span', 'Documents, sports, entertainment, and the remaining rooms.')); options.append(more); }
   body.append(options);
  }
  $('book-note').textContent = chapter.privacy || 'Choose a tool. Contents always brings you back.';
 }
 $('turn-back').disabled = contents && current.index === 0;
 $('turn-next').disabled = !contents && current.index === chapters.length - 1;
}
$('turn-back').addEventListener('click', () => {
 if (current.kind === 'contents') changePage('contents-' + Math.max(1, current.index));
 else changePage(current.index ? chapters[current.index - 1].id : 'contents');
});
$('turn-next').addEventListener('click', () => {
 if (current.kind === 'contents') changePage(current.index + 1 < Math.ceil(chapters.length / CONTENTS_PER_PAGE) ? 'contents-' + (current.index + 2) : chapters[0].id);
 else if (current.index < chapters.length - 1) changePage(chapters[current.index + 1].id);
});
window.addEventListener('hashchange', () => { if (!opened) enterBook(); else { render(); (current.kind === 'contents' ? $('contents-title') : $('chapter-title')).focus({ preventScroll: true }); } });
if (location.hash) enterBook(); else start.focus({ preventScroll: true });
