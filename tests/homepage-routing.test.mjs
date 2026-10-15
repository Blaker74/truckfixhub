import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const route = readFileSync(new URL('../rebuild-assets/legacy-route.js', import.meta.url), 'utf8');
function redirect(search = '', hash = '') {
 let target;
 runInNewContext(route, { URLSearchParams, location: { search, hash, replace: url => { target = url; } } });
 return target;
}
test('old private tools, discussions, and sign-in callbacks preserve their exact parameters', () => {
 for (const [search, hash] of [
  ['?view=call-notes', ''], ['?view=trucks', ''], ['?view=customers', ''],
  ['?discussion=123', ''], ['?code=auth-code', ''], ['', '#access_token=abc&refresh_token=def&type=recovery'],
  ['', '#discussion-123'], ['?view=account&code=abc', ''], ['?error=access_denied', '#error=expired']
 ]) assert.equal(redirect(search, hash), 'tools.html' + search + hash);
});
test('normal visits and book chapter links keep the book homepage', () => {
 for (const [search, hash] of [['',''], ['', '#contents'], ['', '#casino'], ['', '#sports'], ['?utm_source=bookmark', '#customers'], ['', '#account'], ['', '#login']]) {
  assert.equal(redirect(search, hash), undefined);
 }
});
test('homepage chapters embed the preserved app instead of recursively loading the homepage', () => {
 const book = readFileSync(new URL('../rebuild-assets/book.mjs', import.meta.url), 'utf8');
 assert.match(book, /iframe.src = 'tools.html\?view='/);
 assert.doesNotMatch(book, /index\.html\?/);
 const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
 assert.match(home, /legacy-route.js/);
 assert.match(home, /content="index,follow"/);
});

test('old account entry opens the book account while recovery callbacks retain the auth route', () => {
 assert.equal(redirect('?view=account'), './#account');
 assert.equal(redirect('?view=account', '#access_token=abc&type=recovery'), 'tools.html?view=account#access_token=abc&type=recovery');
});
