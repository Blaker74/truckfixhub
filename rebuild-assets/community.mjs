const PROJECT = 'https://bncqcdlzmawlmfworalq.supabase.co';
const KEY = 'sb_publishable_yz-vrCD_has1enE2Zh5qyQ_IAz7gk80';
const SAVED_KEY = 'tfh.rebuild.saved-posts.v1';

export function filterPosts(posts, media, mode, query, saved) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter(post => {
    if (mode === 'saved' && !saved.has(post.id)) return false;
    if (mode === 'clips' && !(media.get(post.id) || []).some(item => item.mime_type.startsWith('video/'))) return false;
    const text = [post.author_name, post.title, post.body].join(' ').toLowerCase();
    return terms.every(term => text.includes(term));
  });
}

export function discussionURL(id) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error('Invalid post identifier');
  return new URL('tools.html?discussion=' + encodeURIComponent(id), location.href).href;
}

function element(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}

export async function startCommunity(options = {}) {
  const feed = document.getElementById('community-feed');
  if (!feed) return;
  const status = document.getElementById('community-status');
  const refresh = document.getElementById('community-refresh');
  const query = document.getElementById('community-search');
  const authNote = document.getElementById('community-auth-note');
  const tabs = [...document.querySelectorAll('[data-feed-mode]')];
  let posts = [], media = new Map(), mode = options.initialMode || 'latest', saved = new Set(), db = null, token = null, loading = false, revision = 0, disposed = false, authSubscription = null;
  options.signal?.addEventListener('abort', () => { disposed = true; authSubscription?.unsubscribe(); feed.querySelectorAll('video').forEach(video => video.pause()); }, { once: true });
  if (options.signal?.aborted) return;
  try { const ids = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); if (Array.isArray(ids)) saved = new Set(ids.filter(id => typeof id === 'string').slice(0, 500)); } catch {}

  async function request(path) {
    const headers = { apikey: KEY };
    if (token) headers.Authorization = 'Bearer ' + token;
    const timeout = AbortSignal.timeout(15000);
    const signal = options.signal && AbortSignal.any ? AbortSignal.any([timeout, options.signal]) : timeout;
    const response = await fetch(PROJECT + '/rest/v1/' + path, { headers, signal });
    if (!response.ok) throw new Error('Community request failed (' + response.status + ')');
    return response.json();
  }

  function render() {
    if (disposed) return;
    // Pause playback before removing videos on filter changes and refresh.
    for (const video of feed.querySelectorAll('video')) video.pause();
    feed.replaceChildren();
    const visible = filterPosts(posts, media, mode, query.value, saved);
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.feedMode === mode)));
    for (const post of visible) {
      const card = element('article', undefined, 'feed-post');
      const heading = element('div', undefined, 'post-heading');
      const avatar = element('span', (post.author_name || 'T').slice(0, 1).toUpperCase(), 'post-avatar');
      avatar.setAttribute('aria-hidden', 'true');
      const byline = element('div');
      byline.append(element('strong', post.author_name || 'TruckFixHub member'));
      const time = element('time');
      const date = new Date(post.created_at);
      if (Number.isFinite(date.getTime())) { time.dateTime = date.toISOString(); time.textContent = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
      byline.append(time); heading.append(avatar, byline); card.append(heading);
      const title = element('a', post.title || 'Community post'); title.href = discussionURL(post.id);
      if (options.externalDiscussion) { title.target = '_blank'; title.rel = 'noopener'; }
      card.append(element('h3')); card.lastChild.append(title);
      card.append(element('p', (post.body || '').slice(0, 1200), 'post-body'));
      for (const item of (media.get(post.id) || []).slice(0, 4)) {
        if (!item.signedUrl) continue;
        const url = new URL(item.signedUrl);
        if (url.origin !== PROJECT) continue;
        const isVideo = item.mime_type.startsWith('video/');
        if (mode === 'clips' && !isVideo) continue;
        const asset = element(isVideo ? 'video' : 'img');
        asset.src = url.href;
        if (isVideo) { asset.controls = true; asset.playsInline = true; asset.preload = 'metadata'; }
        else { asset.alt = item.file_name || 'Community photo'; asset.loading = 'lazy'; }
        asset.addEventListener('error', () => asset.replaceWith(element('p', 'Attachment unavailable. Refresh to try again.')));
        card.append(asset);
      }
      const actions = element('div', undefined, 'post-actions');
      const open = element('a', 'Like · Comment →'); open.href = discussionURL(post.id);
      if (options.externalDiscussion) { open.target = '_blank'; open.rel = 'noopener'; }
      const save = element('button', saved.has(post.id) ? 'Saved' : 'Save'); save.type = 'button'; save.setAttribute('aria-pressed', String(saved.has(post.id)));
      save.addEventListener('click', () => {
        const next = new Set(saved);
        if (next.has(post.id)) next.delete(post.id); else next.add(post.id);
        if (next.size > 500) { status.textContent = 'You can save up to 500 posts on this device.'; return; }
        try { localStorage.setItem(SAVED_KEY, JSON.stringify([...next])); saved = next; render(); status.textContent = 'Saved posts updated on this device.'; }
        catch { status.textContent = 'This browser could not save the post. Your saved list has not changed.'; }
      });
      const share = element('button', 'Share'); share.type = 'button';
      share.addEventListener('click', async () => {
        const url = discussionURL(post.id);
        try {
          if (navigator.share) await navigator.share({ title: post.title || 'TruckFixHub post', url });
          else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); status.textContent = 'Post link copied.'; }
          else { status.textContent = 'Open the post and copy its address to share.'; }
        } catch (error) { if (error.name !== 'AbortError') status.textContent = 'Could not share. Open the post to copy its address.'; }
      });
      actions.append(open, save, share); card.append(actions); feed.append(card);
    }
    if (!visible.length) {
      const text = mode === 'clips' && !token ? 'Sign in to see community photos and videos.' : mode === 'saved' ? 'No saved posts match the latest posts loaded. Save a post here to come back to it on this device.' : query.value ? 'No matching posts in the latest 24. Try another search.' : mode === 'clips' ? 'No video posts are available in the latest 24 posts.' : 'No community posts yet. Share a truck, a question, or something you learned.';
      feed.append(element('p', text, 'feed-empty'));
    }
  }

  async function load() {
    if (loading || disposed) return;
    loading = true; refresh.disabled = true; status.textContent = 'Loading community posts…';
    const started = revision;
    let mediaWarning = '';
    try {
      const nextPosts = await request('posts?select=id,author_name,title,body,created_at&order=created_at.desc&limit=24');
      const nextMedia = new Map();
      if (token && db && nextPosts.length) {
        try {
          const rows = await request('tfh_media?select=post_id,mime_type,object_path,file_name&comment_id=is.null&post_id=in.(' + nextPosts.map(post => post.id).join(',') + ')&limit=96');
          if (rows.length) {
            const result = await db.storage.from('truckfixhub-media').createSignedUrls(rows.map(item => item.object_path), 3600);
            if (result.error) throw result.error;
            const urls = new Map((result.data || []).map(item => [item.path, item.signedUrl]));
            for (const item of rows) { item.signedUrl = urls.get(item.object_path); if (!nextMedia.has(item.post_id)) nextMedia.set(item.post_id, []); nextMedia.get(item.post_id).push(item); }
          }
        } catch { mediaWarning = ' Photos and videos could not load. Refresh or open the community to retry.'; }
      }
      if (started !== revision || disposed) return;
      posts = nextPosts; media = nextMedia;
      render(); status.textContent = 'Showing ' + posts.length + ' of the latest posts.' + mediaWarning;
    } catch {
      if (disposed) return;
      status.textContent = 'Community unavailable right now. Tap Refresh to retry, or open the community below.';
      if (!posts.length) feed.replaceChildren(element('p', 'Your community posts will appear here when the connection is restored.', 'feed-empty'));
    } finally { loading = false; refresh.disabled = false; if (started !== revision) setTimeout(load, 0); }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => { mode = tab.dataset.feedMode; render(); }));
  query.addEventListener('input', render);
  refresh.addEventListener('click', load);
  await load();
  if (disposed) return;
  // Load public posts even if the optional account library is unavailable.
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/+esm');
    if (disposed) return;
    db = createClient(PROJECT, KEY);
    const { data } = await db.auth.getSession();
    if (disposed) return;
    token = data.session?.access_token || null;
    authNote.hidden = !!token;
    if (token) await load();
    if (disposed) return;
    const { data: auth } = db.auth.onAuthStateChange((_event, session) => {
      if (disposed) return;
      const next = session?.access_token || null;
      if (next !== token) { token = next; revision++; media = new Map(); render(); authNote.hidden = !!token; setTimeout(load, 0); }
    });
    authSubscription = auth.subscription;
  } catch { authNote.hidden = false; }
}

