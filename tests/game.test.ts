import test from 'node:test';
import assert from 'node:assert/strict';
import {
  distanceBetween,
  scoreDistance,
  shuffleQuestions,
  clampPoint,
  rankFor,
  readBest,
  saveBest,
  readCampus,
  saveCampus,
} from '../src/lib/game.ts';
import { campuses } from '../src/data/campuses.ts';
test('distance is symmetric and respects the map scale', () => {
  assert.equal(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }, 0.8), 4);
  assert.equal(distanceBetween({ x: 3, y: 4 }, { x: 0, y: 0 }, 0.8), 4);
  assert.equal(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }, 1.2), 6);
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
  for (const campus of campuses) {
    const bounds = campus.map.bounds;
    assert.deepEqual(clampPoint({ x: -100, y: 99999 }, bounds), {
      x: bounds.x,
      y: bounds.y + bounds.height,
    });
  }
});
test('rank boundary values match the full-game maximum', () => {
  assert.equal(rankFor(25000, '鼓楼').title, '鼓楼活地图');
  assert.equal(rankFor(25000, '仙林').title, '仙林活地图');
  assert.equal(rankFor(0, '仙林').title, '初来寻南');
});
test('campus records are isolated and the original Gulou record is retained', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map<string, string>([['nanxun-best-v1', '19000']]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  try {
    assert.equal(readBest('gulou'), 19000);
    assert.equal(readBest('xianlin'), 0);
    saveBest('xianlin', 12000);
    saveBest('gulou', 18000);
    assert.equal(readBest('gulou'), 19000);
    assert.equal(readBest('xianlin'), 12000);
    saveBest('xianlin', 25000);
    saveBest('xianlin', NaN);
    saveBest('xianlin', 26000);
    assert.equal(readBest('xianlin'), 25000);
    assert.equal(readBest('gulou'), 19000);
    assert.equal(readCampus(), 'gulou');
    saveCampus('xianlin');
    assert.equal(readCampus(), 'xianlin');
    values.set('nanxun-campus-v1', 'unknown-campus');
    assert.equal(readCampus(), 'gulou');
    values.set('nanxun-best-v2-xianlin', '-100');
    assert.equal(readBest('xianlin'), 0);
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Storage blocked');
      },
    });
    assert.equal(readBest('xianlin'), 0);
    assert.equal(readCampus(), 'gulou');
    assert.doesNotThrow(() => saveBest('xianlin', 10000));
    assert.doesNotThrow(() => saveCampus('xianlin'));
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
