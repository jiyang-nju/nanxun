import test from 'node:test';
import assert from 'node:assert/strict';
import {
  distanceBetween,
  scoreDistance,
  shuffleQuestions,
  clampPoint,
  MAP_BOUNDS,
  rankFor,
} from '../src/lib/game.ts';
test('distance is symmetric and respects the map scale', () => {
  assert.equal(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }), 4);
  assert.equal(distanceBetween({ x: 3, y: 4 }, { x: 0, y: 0 }), 4);
});
test('landmark tolerance gives full points, score falls monotonically and is bounded', () => {
  assert.equal(scoreDistance(0), 5000);
  assert.equal(scoreDistance(20), 5000);
  let previous = 5000;
  for (let d = 21; d < 2000; d++) {
    const score = scoreDistance(d);
    assert.ok(score <= previous && score >= 0);
    previous = score;
  }
  assert.equal(scoreDistance(NaN), 0);
  assert.equal(scoreDistance(-1), 0);
});
test('a deck never repeats or mutates the source', () => {
  const items = [1, 2, 3, 4, 5];
  const result = shuffleQuestions(items, () => 0.25);
  assert.deepEqual([...result].sort(), items);
  assert.notDeepEqual(result, items);
  assert.deepEqual(items, [1, 2, 3, 4, 5]);
});
test('keyboard selection cannot escape the map', () => {
  assert.deepEqual(clampPoint({ x: -100, y: 99999 }), {
    x: MAP_BOUNDS.x,
    y: MAP_BOUNDS.y + MAP_BOUNDS.height,
  });
});
test('rank boundary values match the full-game maximum', () => {
  assert.equal(rankFor(25000).title, '鼓楼活地图');
  assert.equal(rankFor(0).title, '初来寻南');
});
