// Keep existing tool bookmarks and emailed sign-in links working after the homepage rebuild.
(() => {
 const params = new URLSearchParams(location.search);
 const accountOnly = params.get('view') === 'account' && [...params.keys()].every(key => key === 'view');
 if (accountOnly && !location.hash) { location.replace('./#account'); return; }
 const toolQuery = ['view', 'discussion', 'code', 'error', 'error_description', 'token_hash', 'type'].some(key => params.has(key));
 const legacyHash = /^#(?:discussion-|forum$|home$|access_token=|refresh_token=|error=|type=)/i.test(location.hash);
 if (toolQuery || legacyHash) location.replace('tools.html' + location.search + location.hash);
})();
