import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { campuses } from '../src/data/campuses.ts';
import { clampPoint, ROUND_COUNT, shuffleQuestions } from '../src/lib/game.ts';

test('each campus provides a playable deck with in-bounds landmarks and local credited photos', () => {
  const credits = JSON.parse(
    readFileSync(new URL('../src/data/credits.json', import.meta.url), 'utf8'),
  );
  const seen = new Set<string>();
  for (const campus of campuses) {
    assert.ok(campus.questions.length >= ROUND_COUNT);
    assert.ok(campus.map.metersPerUnit > 0);
    assert.deepEqual(clampPoint(campus.map.center, campus.map.bounds), campus.map.center);
    for (const question of campus.questions) {
      assert.ok(!seen.has(question.id), `Duplicate id: ${question.id}`);
      seen.add(question.id);
      assert.deepEqual(clampPoint(question.position, campus.map.bounds), question.position);
      assert.ok(existsSync(new URL(`../public/${question.image}`, import.meta.url)));
      const credit = credits.find((item: { id: string }) => item.id === question.id);
      assert.equal(credit?.campus, campus.id);
      assert.equal(credit?.source, question.source);
      assert.equal(`photos/${credit?.file}`, question.image);
    }
    const deck = shuffleQuestions(campus.questions).slice(0, ROUND_COUNT);
    assert.equal(new Set(deck.map((q) => q.id)).size, ROUND_COUNT);
    assert.ok(deck.every((q) => campus.questions.includes(q)));
  }
  assert.equal(credits.length, seen.size);
});
