import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMedia,postPayload,saveAttachment} from '../assets/community-data.mjs';
const photo={name:'repair.jpg',type:'image/jpeg',size:100};
const options={id:'attachment',userId:'member',postId:'post'};
function mock({reads=[{data:null}],uploadError=null,insertError=null,insertThrows=false,cleanupError=null}={}){
 const events=[];let read=0;
 const bucket={upload:async(path,file,opts)=>{events.push(['upload',path,opts]);return {error:uploadError};},remove:async paths=>{events.push(['remove',paths]);return {error:cleanupError};}};
 const db={storage:{from:()=>bucket},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>reads[Math.min(read++,reads.length-1)]})}),insert:metadata=>({select:()=>({single:async()=>{events.push(['insert',metadata]);if(insertThrows)throw Error('network');return {data:insertError?null:{id:metadata.id},error:insertError};}})})})};
 return {db,events};
}
test('media limits agree with the existing private bucket',()=>{
 assert.equal(validateMedia([photo]).length,1);
 assert.throws(()=>validateMedia(Array(5).fill(photo)),/four/);
 assert.throws(()=>validateMedia([{...photo,type:'text/html'}]),/JPEG/);
 assert.throws(()=>validateMedia([{...photo,size:0}]),/1 byte/);
 assert.throws(()=>validateMedia([{...photo,size:10*1024*1024+1}]),/10 MB/);
 assert.equal(validateMedia([{name:'clip.mp4',type:'video/mp4',size:50*1024*1024}]).length,1);
});
test('post payload meets the legacy schema without inventing a truck',()=>{
 const p=postPayload({id:'p',userId:'u',name:'B',caption:'  An electrical issue  ',category:'Electrical',hasMedia:false});
 assert.equal(p.author_name,'TruckFixHub member');assert.equal(p.body,'An electrical issue');assert.equal(p.vehicle,'Community');assert.equal(p.make,'Other');
 assert.throws(()=>postPayload({caption:'a',hasMedia:false}),/5 and/);
 assert.match(postPayload({caption:'',hasMedia:true}).body,/photos or video/);
});
test('successful upload saves deterministic metadata with no overwrite',async()=>{
 const {db,events}=mock();await saveAttachment(db,photo,options);
 assert.equal(events[0][1],'member/attachment.jpg');assert.equal(events[0][2].upsert,false);assert.equal(events[1][1].post_id,'post');assert(!events.some(e=>e[0]==='remove'));
});
test('retry of a confirmed attachment never uploads twice',async()=>{
 const {db,events}=mock({reads:[{data:{id:'attachment'}}]});await saveAttachment(db,photo,options);assert.equal(events.length,0);
});
test('lost insert response reconciles metadata and keeps the file',async()=>{
 const {db,events}=mock({insertThrows:true,reads:[{data:null},{data:{id:'attachment'}}]});await saveAttachment(db,photo,options);assert(!events.some(e=>e[0]==='remove'));
});
test('uncertain metadata status never deletes potentially committed media',async()=>{
 const {db,events}=mock({insertError:{message:'network'},reads:[{data:null},{error:{message:'offline'}}]});await assert.rejects(saveAttachment(db,photo,options),/uncertain/);assert(!events.some(e=>e[0]==='remove'));
});
test('confirmed insert rejection cleans an orphan and explains partial success',async()=>{
 const {db,events}=mock({insertError:{message:'rejected'},reads:[{data:null},{data:null}]});await assert.rejects(saveAttachment(db,photo,options),/post is saved.*attachment was not saved/);assert.equal(events.at(-1)[0],'remove');
});
test('duplicate after interrupted upload proceeds to metadata reconciliation',async()=>{
 const {db,events}=mock({uploadError:{statusCode:'409',message:'already exists'}});await saveAttachment(db,photo,options);assert.equal(events.at(-1)[0],'insert');
});
test('ordinary upload failures never create metadata',async()=>{
 const {db,events}=mock({uploadError:{statusCode:'500',message:'offline'}});await assert.rejects(saveAttachment(db,photo,options),/could not be confirmed/);assert(!events.some(e=>e[0]==='insert'));
});
test('account change before upload prevents a write',async()=>{
 const {db,events}=mock();await assert.rejects(saveAttachment(db,photo,{...options,stillCurrent:()=>false}),/account changed/);assert.equal(events.length,0);
});
test('account change during upload avoids attaching to a new account',async()=>{
 const {db,events}=mock();let checks=0;await assert.rejects(saveAttachment(db,photo,{...options,stillCurrent:()=>++checks===1}),/account changed/);assert.equal(events.at(-1)[0],'remove');assert(!events.some(e=>e[0]==='insert'));
});
