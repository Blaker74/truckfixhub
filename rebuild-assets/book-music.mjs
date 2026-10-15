export function musicMayPlay({ enabled, opened, hidden, blocked }) {
 return enabled && opened && !hidden && !blocked;
}

export function createBookMusic(button) {
 const audio = new Audio('denis-pavlov-music-soothing-jazz-cozy-relaxing-serene-music-317588.mp3');
 audio.loop = true; audio.preload = 'none'; audio.setAttribute('playsinline', '');
 let enabled = true, opened = false, context = null, gain = null, source = null, needsTap = false, warming = false, failed = false;
 const blocks = new Set();
 try { enabled = localStorage.getItem('tfh.backgroundMusic') !== 'off'; } catch {}
 function paint() {
  button.textContent = failed ? 'Retry music' : enabled && needsTap ? 'Play music' : enabled ? 'Music on' : 'Music off';
  button.setAttribute('aria-pressed', String(enabled));
  button.setAttribute('aria-label', failed ? 'Retry background jazz' : enabled && needsTap ? 'Play background jazz' : enabled ? 'Turn background jazz off' : 'Turn background jazz on');
 }
 function canPlay() { return musicMayPlay({ enabled, opened, hidden: document.hidden, blocked: blocks.size > 0 }); }
 function silence() { audio.pause(); if (gain) gain.gain.value = 0; }
 function play() {
  audio.play().then(() => {
   needsTap = false;
   if (!canPlay() && !warming) silence();
   paint();
  }).catch(error => { warming = false; needsTap = error.name === 'NotAllowedError'; failed = !needsTap; paint(); });
 }
 function sync() {
  if (canPlay()) {
   warming = false;
   if (gain) { gain.gain.value = .16; audio.muted = false; }
   else { audio.muted = false; audio.volume = .16; }
   if (context?.state === 'suspended') context.resume().catch(() => {});
   play();
  } else if (!warming) silence();
  paint();
 }
 function unlock() {
  if (!enabled) return;
  failed = false;
  try {
   if (!context) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (AudioCtor) {
     context = new AudioCtor(); gain = context.createGain(); gain.gain.value = 0;
     source = context.createMediaElementSource(audio); source.connect(gain); gain.connect(context.destination);
    }
   }
   if (context) { context.resume().catch(() => {}); audio.muted = false; }
   else audio.muted = true;
   // Unlock from the Start Truck gesture. The gain stays at zero during the engine intro.
   warming = !opened; play();
  } catch { warming = false; needsTap = true; paint(); }
 }
 button.addEventListener('click', () => {
  if (!enabled || needsTap || failed) { enabled = true; needsTap = false; unlock(); }
  else { enabled = false; warming = false; }
  try { localStorage.setItem('tfh.backgroundMusic', enabled ? 'on' : 'off'); } catch {}
  sync();
 });
 audio.addEventListener('error', () => { failed = true; paint(); });
 document.addEventListener('visibilitychange', () => { if (document.hidden) { warming = false; silence(); } else sync(); });
 window.addEventListener('pagehide', () => { warming = false; silence(); if (context?.state === 'running') context.suspend().catch(() => {}); });
 window.addEventListener('pageshow', () => { if (opened) sync(); });
 paint();
 return {
  unlock,
  open() { opened = true; warming = false; sync(); },
  block(reason, value) { if (value) blocks.add(reason); else blocks.delete(reason); sync(); }
 };
}
