// Reuse the original logo directly from the existing homepage. No replacement
// artwork or duplicate binary asset is required. Text stays visible on failure.
async function loadOriginalLogo(){
 const images=[...document.querySelectorAll('[data-original-logo]')];if(!images.length)return;
 try{
  const response=await fetch('index.html',{cache:'force-cache'});if(!response.ok)throw Error('Logo unavailable');
  let html='',match;
  if(response.body?.getReader){const reader=response.body.getReader(),decoder=new TextDecoder();try{while(html.length<11000000){const part=await reader.read();if(part.done)break;html+=decoder.decode(part.value,{stream:true});match=html.match(/<img\s[^>]*id="tfh-intro-logo"[^>]*src="(data:image\/png;base64,[A-Za-z0-9+/=]+)"/);if(match)break;}}finally{await reader.cancel();}}
  else{html=await response.text();match=html.match(/<img\s[^>]*id="tfh-intro-logo"[^>]*src="(data:image\/png;base64,[A-Za-z0-9+/=]+)"/);}
  if(!match)return;
  for(const img of images){img.onload=()=>{img.hidden=false;const fallback=img.parentElement.querySelector('.brand-fallback');if(fallback)fallback.hidden=true;};img.src=match[1];}
 }catch{/* The original homepage and readable wordmark remain available. */}
}
loadOriginalLogo();
