import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chapters, contents, readPage, remainingSeconds } from '../rebuild-assets/book-data.mjs';

test('fourteen pages follow the requested photo and tool sequence', () => {
 assert.deepEqual(chapters.map(page => page.id), [
  'cascadia','community','peterbilt','vins','international','call-notes','kenworth','customers',
  'western-star','diesel-reel','mack','super-miller','volvo','gear'
 ]);
 assert.deepEqual(chapters.filter(page => page.view).map(page => page.view), ['forum','trucks','call-notes','customers','supermiller']);
 assert(chapters[9].reels); assert(chapters[13].gear);
});
test('literal table of contents maps seven chapters to cover and interactive pages', () => {
 assert.equal(contents.length, 7);
 contents.forEach((entry,index) => {
  assert.equal(entry.coverNumber, index*2+1);
  assert.equal(entry.pageNumber, index*2+2);
  assert.equal(chapters[entry.coverNumber-1].id,entry.coverId);
  assert.equal(chapters[entry.pageNumber-1].id,entry.pageId);
 });
});
test('all seven covers use available photographs with year and source attribution', () => {
 const covers=chapters.filter(page => page.cover);
 assert.equal(covers.length,7);
 for (const page of covers) {
  assert(page.title.startsWith('2027 '));
  assert(existsSync(new URL('../'+page.image,import.meta.url)),page.image);
  assert.equal(new URL(page.source).protocol,'https:');
  assert(page.credit.length>3);
 }
});
test('every page supports a direct link and unknown links return to contents', () => {
 const ids=new Set();
 chapters.forEach((page,index) => {
  assert(!ids.has(page.id));ids.add(page.id);
  assert.deepEqual(readPage('#'+page.id),{kind:'chapter',index});
 });
 for(const hash of ['','#contents','#contents-999','#unknown'])assert.deepEqual(readPage(hash),{kind:'contents',index:0});
});
test('engine countdown lasts ten seconds and never displays negative seconds', () => {
 assert.equal(remainingSeconds(10500,500),10);
 assert.equal(remainingSeconds(10500,1499),10);
 assert.equal(remainingSeconds(10500,1500),9);
 assert.equal(remainingSeconds(10500,10499),1);
 assert.equal(remainingSeconds(10500,10500),0);
 assert.equal(remainingSeconds(10500,12000),0);
});
