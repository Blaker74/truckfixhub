export const MEDIA_TYPES = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/quicktime':'mov','video/webm':'webm'};

export function validateMedia(files) {
  if (files.length > 4) throw new Error('Choose up to four photos or videos.');
  for (const file of files) {
    if (!MEDIA_TYPES[file.type]) throw new Error('Use JPEG, PNG, WebP, MP4, MOV, or WebM.');
    const limit = file.type.startsWith('image/') ? 10 : 50;
    if (!file.size || file.size > limit * 1024 * 1024) throw new Error(`${file.name}: choose a file between 1 byte and ${limit} MB.`);
  }
  return files;
}

export function postPayload({id, userId, name, caption, category, hasMedia}) {
  const body = caption.trim() || (hasMedia ? 'Shared photos or video with the TruckFixHub community.' : '');
  if (body.length < 5 || body.length > 10000) throw new Error('Write between 5 and 10,000 characters, or attach a photo or video.');
  return {id, user_id:userId, author_name:(name?.trim().length>=2 ? name.trim() : 'TruckFixHub member').slice(0,40),
    title:body.replace(/\s+/g,' ').slice(0,140), body, category, make:'Other', vehicle:'Community'};
}

export async function saveAttachment(db, file, {id, userId, postId, commentId=null, stillCurrent=()=>true}) {
  validateMedia([file]);
  const bucket = db.storage.from('truckfixhub-media');
  const path = `${userId}/${id}.${MEDIA_TYPES[file.type]}`;
  if (!stillCurrent()) throw new Error('Your account changed. Sign in and try again.');
  // A retry first reconciles its deterministic metadata ID. Never delete a file
  // just because a network response to a successful insert was lost.
  const previous = await db.from('tfh_media').select('id').eq('id',id).maybeSingle();
  if (previous.error) throw new Error('Could not check attachment status. Your selection is still available to retry.');
  if (previous.data) return previous.data;
  const uploaded = await bucket.upload(path,file,{contentType:file.type,upsert:false});
  // A prior attempt may have stored the bytes before its response was lost.
  // Paths use a per-draft UUID and upsert is forbidden; a duplicate reconciles
  // that same attachment rather than replacing anyone's object.
  if (uploaded.error && !['409','Duplicate'].includes(String(uploaded.error.statusCode || uploaded.error.error))) throw new Error('The file upload could not be confirmed. '+uploaded.error.message);
  if (!stillCurrent()) {
    await bucket.remove([path]);
    throw new Error('Your account changed before the attachment was saved.');
  }
  const metadata = {id,user_id:userId,post_id:postId,comment_id:commentId,object_path:path,mime_type:file.type,file_name:file.name.slice(0,150),size_bytes:file.size};
  let inserted;
  try { inserted = await db.from('tfh_media').insert(metadata).select('id').single(); }
  catch { inserted = {error:{message:'Network response interrupted.'}}; }
  if (!inserted.error) return inserted.data;
  let confirmed;
  try { confirmed = await db.from('tfh_media').select('id').eq('id',id).maybeSingle(); }
  catch { confirmed = {error:{message:'Connection unavailable.'}}; }
  if (confirmed.data) return confirmed.data;
  if (confirmed.error) throw new Error('Attachment status is uncertain. Your post is saved. Retry after your connection returns.');
  const cleanup = await bucket.remove([path]);
  throw new Error('Your post is saved, but this attachment was not saved. '+inserted.error.message+(cleanup.error?' File cleanup also needs attention.':''));
}
