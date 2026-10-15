import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, CONTENTS_PER_PAGE, readPage, remainingSeconds } from '../rebuild-assets/book-data.mjs';

test('requested first three chapters retain their existing live tools', () => {
 assert.deepEqual(chapters.slice(0, 3).map(chapter => [chapter.title, chapter.view]), [
  ['Trucking Community Chat', 'forum'], ['My VIN List', 'trucks'], ['Parts Counter', 'parts']
 ]);
});
test('contents can be paged without invalid chapter or page indexes', () => {
 assert.equal(CONTENTS_PER_PAGE, 2);
 assert.deepEqual(readPage('#contents-2'), { kind: 'contents', index: 1 });
 assert.deepEqual(readPage('#contents-999'), { kind: 'contents', index: 2 });
 assert.deepEqual(readPage('#contents-0'), { kind: 'contents', index: 0 });
 assert.deepEqual(readPage('#not-a-real-chapter'), { kind: 'contents', index: 0 });
 assert.deepEqual(readPage(''), { kind: 'contents', index: 0 });
});
test('every chapter has a direct link and a descriptive contents entry', () => {
 const ids = new Set();
 chapters.forEach((chapter, index) => {
  assert(!ids.has(chapter.id)); ids.add(chapter.id);
  assert.deepEqual(readPage('#' + chapter.id), { kind: 'chapter', index });
  assert(chapter.description.length > 50);
  assert(chapter.view || chapter.links?.length || chapter.tools?.length);
 });
});
test('engine countdown begins at ten and ends at zero without negative numbers', () => {
 assert.equal(remainingSeconds(10500, 500), 10);
 assert.equal(remainingSeconds(10500, 1499), 10);
 assert.equal(remainingSeconds(10500, 1500), 9);
 assert.equal(remainingSeconds(10500, 10499), 1);
 assert.equal(remainingSeconds(10500, 10500), 0);
 assert.equal(remainingSeconds(10500, 12000), 0);
});
test('Fourthwall and feedback remain available while extra rooms leave the main chapters', () => {
 assert(chapters.at(-1).links.some(item => item[2] === 'https://truckfixhub-gear-shop.fourthwall.com/'));
 assert(chapters.at(-1).links.some(item => item[2] === 'industry-survey.html'));
 assert(!chapters.some(chapter => /casino|sports|audiobooks|restaurant|showers/.test(chapter.id)));
});
