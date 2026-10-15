import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPosts, discussionURL } from '../rebuild-assets/community.mjs';

const posts = [
  { id: '11111111-1111-4111-8111-111111111111', author_name: 'Blake', title: 'DD15 coolant', body: 'Found the leak' },
  { id: '22222222-2222-4222-8222-222222222222', author_name: 'Driver', title: 'Morning run', body: 'A truck video' },
  { id: '33333333-3333-4333-8333-333333333333', author_name: null, title: null, body: null }
];
const media = new Map([[posts[1].id, [{ mime_type: 'video/mp4' }]], [posts[0].id, [{ mime_type: 'image/jpeg' }]]]);
test('feed search matches author and content, ignores case and extra spaces', () => {
  assert.deepEqual(filterPosts(posts, media, 'latest', ' BLAKE   coolant ', new Set()), [posts[0]]);
  assert.deepEqual(filterPosts(posts, media, 'latest', 'missing', new Set()), []);
});
test('Diesel Reel excludes photo-only and text-only posts', () => {
  assert.deepEqual(filterPosts(posts, media, 'clips', '', new Set()), [posts[1]]);
  assert.deepEqual(filterPosts(posts, new Map(), 'clips', '', new Set()), []);
});
test('saved posts respect search and do not invent posts outside current feed', () => {
  const saved = new Set([posts[0].id, 'not-loaded']);
  assert.deepEqual(filterPosts(posts, media, 'saved', '', saved), [posts[0]]);
  assert.deepEqual(filterPosts(posts, media, 'saved', 'morning', saved), []);
});
test('null content and a whitespace search remain safe', () => {
  assert.deepEqual(filterPosts(posts, media, 'latest', '  ', new Set()), posts);
});
test('share URLs target the existing discussion and reject injected paths', () => {
  globalThis.location = { href: 'https://truckfixhub.com/rebuild.html' };
  assert.equal(discussionURL(posts[0].id), 'https://truckfixhub.com/index.html?discussion=' + posts[0].id);
  assert.throws(() => discussionURL('javascript:alert(1)'));
  assert.throws(() => discussionURL('../private'));
});
