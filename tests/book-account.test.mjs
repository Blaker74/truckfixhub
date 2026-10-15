import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../rebuild-assets/book.mjs', import.meta.url), 'utf8');
const accountCode = source.slice(source.indexOf('let accountDialog = null;'), source.indexOf('function prepareFrame('));
class Element extends EventTarget {
 constructor(tag) { super(); this.tag = tag; this.children = []; this.removed = false; }
 append(...nodes) { this.children.push(...nodes); }
 setAttribute() {}
 showModal() { this.open = true; }
 close() { if (!this.open) return; this.open = false; this.dispatchEvent(new Event('close')); }
 remove() { this.removed = true; }
 focus() {}
}
test('account login and closing return to the mounted book without changing its chapter', () => {
 const elements = [], blocks = [], button = new Element('button'), innerAuth = new Element('dialog');
 const head = new Element('head');
 const context = {
  node(tag) { const el = new Element(tag); elements.push(el); if (tag === 'iframe') el.contentDocument = { head, createElement: tag => new Element(tag), getElementById: () => innerAuth }; return el; },
  document: { body: new Element('body') },
  canLeaveChapter: () => true, music: { block: (...args) => blocks.push(args) }, $: () => button,
 };
 runInNewContext(accountCode, context);
 button.dispatchEvent(new Event('click'));
 const outer = elements.find(el => el.tag === 'dialog'), frame = elements.find(el => el.tag === 'iframe');
 assert.equal(outer.open, true);
 assert.equal(frame.src, 'tools.html?view=account');
 frame.dispatchEvent(new Event('load'));
 // The existing auth code emits close after a successful password sign-in or signup.
 innerAuth.dispatchEvent(new Event('close'));
 assert.equal(outer.removed, true);
 assert.equal(frame.src, 'about:blank');
 assert.deepEqual(blocks, [['account', true], ['account', false]]);
});
test('both public entry points keep Account inside the handbook', () => {
 for (const path of ['index.html', 'rebuild.html']) {
  const html = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  assert.match(html, /id="book-account-open"/);
  assert.doesNotMatch(html, /href="tools.html\?view=account"/);
 }
});
