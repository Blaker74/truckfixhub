// Embedded Safari can suppress native confirm(). Ask in the note card instead.
export function installCallNoteDelete(doc) {
 const list=doc.getElementById('cn-list');
 if(!list||list.dataset.deleteConfirmation)return;
 list.dataset.deleteConfirmation='inline';
 list.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button||!list.contains(button)||button.textContent.trim()!=='Delete')return;
  event.preventDefault();event.stopImmediatePropagation();
  if(button.disabled||typeof button.onclick!=='function')return;
  button.disabled=true;
  const panel=doc.createElement('div');panel.className='cn-delete-confirm';panel.setAttribute('role','group');panel.setAttribute('aria-label','Confirm note deletion');
  const status=doc.createElement('p');status.textContent='Permanently delete this request and its audio?';status.setAttribute('role','status');
  const remove=doc.createElement('button'),cancel=doc.createElement('button');
  remove.type=cancel.type='button';remove.className='btn';cancel.className='btn secondary';remove.textContent='Delete permanently';cancel.textContent='Keep note';
  cancel.onclick=()=>{panel.remove();button.disabled=false;button.focus();};
  remove.onclick=async()=>{
   if(remove.disabled||!button.isConnected)return;
   remove.disabled=cancel.disabled=true;status.textContent='Deleting request…';
   const win=doc.defaultView,original=win.confirm;
   let pending;
   try{
    // The user has explicitly confirmed this one deletion. Restore synchronously
    // before awaiting the existing authenticated, owner-scoped delete handler.
    win.confirm=message=>message==='Permanently delete this request and its audio?'?true:original.call(win,message);
    pending=button.onclick.call(button);
   }catch(error){pending=Promise.reject(error);}finally{win.confirm=original;}
   try{
    await pending;
    if(button.isConnected){const inbox=doc.getElementById('cn-inbox-status');status.textContent=inbox?.textContent||'Could not delete. Refresh your inbox and try again.';}
   }catch(error){status.textContent='Could not delete: '+error.message;}
   finally{button.disabled=false;remove.disabled=cancel.disabled=false;}
  };
  panel.append(status,remove,cancel);button.parentNode.append(panel);panel.scrollIntoView({block:'nearest',behavior:'smooth'});cancel.focus({preventScroll:true});
 },true);
}
