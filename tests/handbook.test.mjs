import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { chapters, contents, readPage, remainingSeconds, turnDirection } from '../rebuild-assets/book-data.mjs';

test('nineteen pages keep the photo/tool sequence and end with Casino, Sports and Shop Gear', () => {
 assert.deepEqual(chapters.map(page => page.id), [
  'cascadia','community','peterbilt','vins','international','call-notes','kenworth','customers',
  'western-star','diesel-reel','mack','super-miller','volvo','repair-guides','repair-shops','fuel-calculator','casino','sports','gear'
 ]);
 assert.deepEqual(chapters.filter(page => page.view).map(page => page.view), ['forum','trucks','call-notes','customers','supermiller','casino','sports']);
 assert(chapters[9].reels); assert(chapters.at(-1).gear);
});
test('contents maps seven truck chapters plus public resources, Casino, Sports and Gear to the correct pages', () => {
 assert.equal(contents.length, 12);
 contents.slice(0,7).forEach((entry,index) => {
  assert.equal(entry.coverNumber, index*2+1);
  assert.equal(entry.pageNumber, index*2+2);
  assert.equal(chapters[entry.coverNumber-1].id,entry.coverId);
  assert.equal(chapters[entry.pageNumber-1].id,entry.pageId);
 });
 assert.equal(contents[9].pageId,'casino'); assert.equal(contents[9].pageNumber,17);
 assert.equal(contents[10].pageId,'sports'); assert.equal(contents[10].pageNumber,18);
 assert.equal(contents[11].pageId,'gear'); assert.equal(contents[11].pageNumber,19);
});
test('all seven covers use generated artwork with clear labels and preserved prompts', () => {
 const covers=chapters.filter(page => page.cover);
 const provenance=JSON.parse(readFileSync(new URL('../rebuild-assets/trucks/sources.json',import.meta.url),'utf8'));
 assert.equal(covers.length,7);
 assert.equal(provenance.length,7);
 for (const page of covers) {
  assert(page.title.startsWith('2027 '));
  assert(existsSync(new URL('../'+page.image,import.meta.url)),page.image);
  assert.equal(page.generated,true);
  assert.equal(page.source,undefined);
  assert(page.credit.includes('AI-generated'));
  assert(page.image.endsWith('-ai.webp'));
  const source=provenance.find(item=>item.id===page.id);
  assert(source?.prompt.length>300);
  assert.equal(source.image,page.image);
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
test('paper turns follow forward and backward navigation, including contents', () => {
 assert.equal(turnDirection(readPage('#contents'),readPage('#cascadia')),'forward');
 assert.equal(turnDirection(readPage('#cascadia'),readPage('#community')),'forward');
 assert.equal(turnDirection(readPage('#community'),readPage('#cascadia')),'backward');
 assert.equal(turnDirection(readPage('#sports'),readPage('#contents')),'backward');
 assert.equal(turnDirection(readPage('#gear'),readPage('#gear')),null);
});
