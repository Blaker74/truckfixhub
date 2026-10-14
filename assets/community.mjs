import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/+esm';
import {validateMedia,postPayload,saveAttachment} from './community-data.mjs';

const db=createClient('https://bncqcdlzmawlmfworalq.supabase.co','sb_publishable_yz-vrCD_has1enE2Zh5qyQ_IAz7gk80');
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const message=(n,text,error=false)=>{n.textContent=text;n.classList.toggle('error',error);};
const fail=r=>{if(r.error)throw r.error;return r.data;};
let user=null,epoch=0,loading=false,offset=0,feedRequest=0,sending=false,draft=null,files=[],previewURLs=[],stream='all';
const pageSize=12;
const name=()=>{const n=(user?.user_metadata?.display_name||user?.user_metadata?.full_name||'').trim();return n.length>=2?n:'TruckFixHub member';};
function needAccount(){if(user)return true;$('sign-in').showModal();return false;}
function date(s){return new Date(s).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});}
function clearPreview(){previewURLs.forEach(URL.revokeObjectURL);previewURLs=[];$('preview').replaceChildren();}
function resetDraft(){draft=null;files=[];clearPreview();$('post-form').reset();$('caption').disabled=false;$('media').disabled=false;$('post-topic').disabled=false;$('publish').textContent='Post to Community';message($('post-status'),'');}
function openComposer(){if(!needAccount())return;$('post-dialog').showModal();$('caption').focus();}
$('new-draft').onclick=()=>{if(sending)return;if(confirm(draft?.saved?'Your text post is already saved. Clear the editor and stop retrying its remaining attachments?':'Clear this draft and selected attachments?'))resetDraft();};
$('compose').onclick=openComposer;$('compose-photo').onclick=openComposer;$('compose-help').onclick=openComposer;
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('close-post').onclick=()=>{if(!sending)$('post-dialog').close();};
$('post-dialog').addEventListener('cancel',e=>{if(sending)e.preventDefault();});
$('account').onclick=async()=>{if(!user){$('sign-in').showModal();return;}if(!confirm('Sign out of TruckFixHub?'))return;try{fail(await db.auth.signOut());}catch(e){message($('feed-status'),'Could not sign out. '+e.message,true);}};
$('login-form').onsubmit=async e=>{e.preventDefault();$('login-submit').disabled=true;message($('login-status'),'Signing in…');try{fail(await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value}));$('password').value='';$('sign-in').close();message($('login-status'),'');}catch(err){message($('login-status'),err.message,true);}finally{$('login-submit').disabled=false;}};
$('media').onchange=()=>{try{const selected=validateMedia([...$('media').files]);files=selected.map(file=>({file,id:crypto.randomUUID(),saved:false}));clearPreview();for(const {file} of files){const url=URL.createObjectURL(file);previewURLs.push(url);const n=el(file.type.startsWith('video/')?'video':'img');n.src=url;if(n.tagName==='VIDEO'){n.controls=true;n.preload='metadata';}else n.alt=file.name;$('preview').append(n);}message($('post-status'),'');}catch(e){files=[];$('media').value='';clearPreview();message($('post-status'),e.message,true);}};

// A draft retains its IDs and selected files until all attachments are confirmed.
// Reconcile an interrupted post insert before offering an attachment retry.
$('post-form').onsubmit=async e=>{
 e.preventDefault();if(sending||!needAccount())return;
 sending=true;$('publish').disabled=true;const uid=user.id;
 try{
  validateMedia(files.map(f=>f.file));
  if(draft&&draft.userId!==uid)throw Error('This draft belongs to a different sign-in. Sign back into that account.');
  if(!draft){draft={id:crypto.randomUUID(),userId:uid,saved:false,payload:postPayload({id:null,userId:uid,name:name(),caption:$('caption').value,category:$('post-topic').value,hasMedia:files.length>0})};$('caption').disabled=true;$('media').disabled=true;$('post-topic').disabled=true;}
  draft.payload.id=draft.id;
  if(!draft.saved){
   message($('post-status'),'Saving your post…');
   const existing=fail(await db.from('posts').select('id').eq('id',draft.id).maybeSingle());
   if(!existing){const result=await db.from('posts').insert(draft.payload).select('id').single();if(result.error){const check=await db.from('posts').select('id').eq('id',draft.id).maybeSingle();if(!check.data)throw Error('Could not confirm your post. Your draft is retained; retry to check before posting again.');}}
   draft.saved=true;$('caption').disabled=true;$('media').disabled=true;$('post-topic').disabled=true;
  }
  for(let i=0;i<files.length;i++){const f=files[i];if(f.saved)continue;message($('post-status'),`Post saved. Uploading attachment ${i+1} of ${files.length}…`);await saveAttachment(db,f.file,{id:f.id,userId:uid,postId:draft.id,stillCurrent:()=>user?.id===uid});f.saved=true;}
  $('post-dialog').close();resetDraft();await loadFeed(true);
 }catch(err){message($('post-status'),err.message,true);$('publish').textContent=draft?.saved?'Retry remaining attachments':'Retry post';}
 finally{sending=false;$('publish').disabled=false;}
};

async function renderMedia(post,container,currentEpoch){
 if(!user){container.append(el('p','Sign in to view any photos and videos attached to this conversation.','media-message'));return;}
 try{
  const rows=fail(await db.from('tfh_media').select('id,object_path,mime_type,file_name').eq('post_id',post.id).is('comment_id',null).order('created_at'));
  if(currentEpoch!==epoch||!container.isConnected)return;
  for(const row of rows||[]){
   if(stream==='photo'&&!row.mime_type.startsWith('image/'))continue;
   if(stream==='video'&&!row.mime_type.startsWith('video/'))continue;
   const signed=fail(await db.storage.from('truckfixhub-media').createSignedUrl(row.object_path,900));
   if(currentEpoch!==epoch||!container.isConnected)return;
   const media=el(row.mime_type.startsWith('video/')?'video':'img');media.src=signed.signedUrl;if(stream==='video')container.classList.add('vertical-video');
   if(media.tagName==='VIDEO'){media.controls=true;media.preload='metadata';media.playsInline=true;}else{media.alt=row.file_name;media.loading='lazy';}
   media.onerror=()=>{media.replaceWith(el('p','This attachment could not load. Refresh the feed to renew access.','media-message'));};container.append(media);
  }
 }catch{if(currentEpoch===epoch)container.append(el('p','Attachments could not load. Refresh to retry.','media-message'));}
}
function renderPost(post,likes,currentEpoch){
 const article=el('article',undefined,'post');article.id='post-'+post.id;
 const head=el('div',undefined,'post-head'),person=el('div',undefined,'post-person');person.append(el('strong',post.author_name),el('small',date(post.created_at)));head.append(el('span','TFH','avatar'),person);
 const report=el('button','Report','report');report.type='button';report.onclick=async()=>{if(!needAccount())return;const reason=prompt('What should the moderator review? (5–500 characters)');if(reason===null)return;if(reason.trim().length<5||reason.trim().length>500){alert('Please write between 5 and 500 characters.');return;}try{fail(await db.from('reports').insert({post_id:post.id,reason:reason.trim()}));report.textContent='Reported';report.disabled=true;}catch(e){alert('Report was not saved. '+e.message);}};head.append(report);
 article.append(head,el('p',post.body,'post-caption'),el('span',post.category,'post-topic'));
 if(post.fix_outcome)article.append(el('p','Repair outcome: '+post.fix_outcome,'post-caption'));
 const media=el('div',undefined,'post-media');article.append(media);
 const actions=el('div',undefined,'post-actions'),like=el('button'),reply=el('button','Replies'),share=el('button','Share');let liked=!!likes?.liked,count=Number(likes?.like_count||0);
 const updateLike=()=>{like.textContent=`${liked?'Liked':'Like'} · ${count}`;like.setAttribute('aria-pressed',String(liked));};updateLike();
 like.onclick=async()=>{if(!needAccount())return;like.disabled=true;try{const uid=user.id;if(liked)fail(await db.from('tfh_post_likes').delete().eq('post_id',post.id).eq('user_id',uid));else fail(await db.from('tfh_post_likes').insert({post_id:post.id,user_id:uid}));liked=!liked;count=Math.max(0,count+(liked?1:-1));updateLike();}catch(e){alert('Your like could not be saved. Refresh before retrying. '+e.message);}finally{like.disabled=false;}};
 const panel=el('div',undefined,'reply-panel');panel.hidden=true;
 reply.onclick=()=>{panel.hidden=!panel.hidden;reply.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)loadReplies(post,panel,currentEpoch);};reply.setAttribute('aria-expanded','false');
 share.onclick=async()=>{const url=new URL('community.html',location.href);url.searchParams.set('post',post.id);try{if(navigator.share)await navigator.share({title:'TruckFixHub community',url:url.href});else{await navigator.clipboard.writeText(url.href);share.textContent='Link copied';}}catch(e){if(e.name!=='AbortError')prompt('Copy this conversation link:',url.href);}};
 actions.append(like,reply,share);article.append(actions,panel);return {article,load:()=>renderMedia(post,media,currentEpoch)};
}
async function loadReplies(post,panel,currentEpoch){
 message(panel,'Loading replies…');
 try{
  const rows=fail(await db.from('comments').select('id,author_name,body,created_at').eq('post_id',post.id).order('created_at').limit(100));
  if(currentEpoch!==epoch)return;panel.replaceChildren();
  panel.append(el('p',rows.length?'Replies (up to the first 100)':'Be the first to reply.','reply-status'));
  for(const row of rows){const n=el('div',undefined,'reply');n.append(el('strong',row.author_name),el('p',row.body),el('small',date(row.created_at)));panel.append(n);}
  const form=el('form',undefined,'reply-form'),input=el('textarea'),submit=el('button','Post reply'),status=el('p',undefined,'reply-status');input.required=true;input.minLength=2;input.maxLength=5000;input.rows=2;input.setAttribute('aria-label','Your reply');submit.type='submit';status.setAttribute('role','status');form.append(input,submit,status);panel.append(form);
  let replyId=crypto.randomUUID();form.onsubmit=async e=>{e.preventDefault();if(!needAccount())return;submit.disabled=true;try{if(input.value.trim().length<2)throw Error('Write at least two characters.');const existing=fail(await db.from('comments').select('id').eq('id',replyId).maybeSingle());if(!existing)fail(await db.from('comments').insert({id:replyId,post_id:post.id,user_id:user.id,author_name:name().slice(0,40),body:input.value.trim()}));replyId=crypto.randomUUID();await loadReplies(post,panel,currentEpoch);}catch(err){message(status,'Could not confirm your reply. Your text is retained. '+err.message,true);}finally{submit.disabled=false;}};
 }catch{message(panel,'Replies could not load. Close and reopen Replies to retry.',true);}
}
async function loadFeed(reset=false){
 if(loading&&!reset)return;const request=++feedRequest;loading=true;$('refresh').disabled=true;$('more').disabled=true;const currentEpoch=epoch;
 if(reset){offset=0;$('feed').replaceChildren();}
 message($('feed-status'),'Loading conversations…');
 try{
  if(stream!=='all'&&!user){message($('feed-status'),'Sign in to browse community photos and videos.');$('more').hidden=true;const box=el('div',undefined,'empty'),button=el('button','Sign in to view '+(stream==='photo'?'photos':'videos'));button.onclick=()=>needAccount();box.append(el('h2','Stories from the road.'),el('p','Attachments are shared with signed-in TruckFixHub members.'),button);$('feed').replaceChildren(box);return;}
  const focus=new URLSearchParams(location.search).get('post');let query=db.from('posts').select('id,author_name,body,category,fix_outcome,created_at'+(stream==='all'?'':',tfh_media!inner(mime_type)')).order('created_at',{ascending:false});
  if(stream!=='all')query=query.like('tfh_media.mime_type',stream==='photo'?'image/%':'video/%');
  if(focus&&/^[0-9a-f-]{36}$/i.test(focus))query=query.eq('id',focus);
  if($('topic').value)query=query.eq('category',$('topic').value);
  const rows=fail(await query.range(offset,offset+pageSize-1));if(request!==feedRequest||currentEpoch!==epoch)return;
  let summaries=[];try{summaries=fail(await db.rpc('tfh_post_like_summary',{p_post_ids:rows.map(p=>p.id)}))||[];}catch{}
  if(request!==feedRequest||currentEpoch!==epoch)return;
  const cards=rows.map(p=>renderPost(p,summaries.find(l=>l.post_id===p.id),currentEpoch));for(const c of cards)$('feed').append(c.article);cards.forEach(c=>c.load());offset+=rows.length;
  $('more').hidden=rows.length<pageSize;message($('feed-status'),focus?'Showing a shared conversation. Use Community to return to all posts.':'Newest conversations first. Refresh to check for new posts.');
  if(!offset){const empty=el('div',undefined,'empty');empty.append(el('h2','Every community starts with one voice.'),el('p','Share a lesson from the shop, a question from the road, or what would help a new technician get started.'));$('feed').append(empty);}
 }catch(err){if(request===feedRequest)message($('feed-status'),'The feed could not load. Tap Refresh to retry. '+err.message,true);}
 finally{if(request===feedRequest){loading=false;$('refresh').disabled=false;$('more').disabled=false;}}
}
$('refresh').onclick=()=>loadFeed(true);$('more').onclick=()=>loadFeed();$('topic').onchange=()=>loadFeed(true);
document.querySelectorAll('[data-stream]').forEach(button=>button.onclick=()=>{stream=button.dataset.stream;document.querySelectorAll('[data-stream]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));loadFeed(true);});
let initial=true;
db.auth.onAuthStateChange((event,session)=>{const next=session?.user||null;const changed=next?.id!==user?.id;user=next;$('account').textContent=user?'Sign out':'Sign in';if(changed||initial){initial=false;epoch++;if(!sending)resetDraft();queueMicrotask(()=>loadFeed(true));}});
window.addEventListener('beforeunload',e=>{if(draft||$('caption').value.trim()||files.length){e.preventDefault();e.returnValue='';}});
setTimeout(()=>{if(initial){initial=false;loadFeed(true);}},4000);
