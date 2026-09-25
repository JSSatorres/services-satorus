import { strict as assert } from "node:assert";
import { test } from "node:test";
import { getChapterIndex } from "../lib/journey-progress.ts";

test("selects the chapter reached by a direct anchor", () => {
  for (let index = 0; index < 8; index += 1)
    assert.equal(getChapterIndex(index * 700, 700, 8), index);
});
test("holds a chapter while reading and reverses at the same boundary", () => {
  assert.equal(getChapterIndex(503, 700, 8), 0);
  assert.equal(getChapterIndex(504, 700, 8), 1);
  assert.equal(getChapterIndex(503, 700, 8), 0);
});
test("clamps overscroll and guards unavailable viewport geometry", () => {
  assert.equal(getChapterIndex(-200, 700, 8), 0);
  assert.equal(getChapterIndex(100000, 700, 8), 7);
  assert.equal(getChapterIndex(700, 0, 8), 0);
  assert.equal(getChapterIndex(Number.NaN, 700, 8), 0);
});
