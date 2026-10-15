import test from 'node:test';
import assert from 'node:assert/strict';
import { musicMayPlay } from '../rebuild-assets/book-music.mjs';
test('background music starts only after entry and respects off, hidden, and media states', () => {
 const ready = { enabled: true, opened: true, hidden: false, blocked: false };
 assert.equal(musicMayPlay(ready), true);
 assert.equal(musicMayPlay({ ...ready, opened: false }), false);
 assert.equal(musicMayPlay({ ...ready, enabled: false }), false);
 assert.equal(musicMayPlay({ ...ready, hidden: true }), false);
 assert.equal(musicMayPlay({ ...ready, blocked: true }), false);
});
