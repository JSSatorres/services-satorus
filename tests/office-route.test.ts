import assert from "node:assert/strict";
import test from "node:test";
import {
  destinationFromHash,
  nextDestination,
  shouldLeavePanel,
} from "../lib/office-route.ts";

test("development anchors resolve to physical destinations", () => {
  assert.equal(destinationFromHash("#como-trabajamos"), 0);
  assert.equal(destinationFromHash("#diagnostico"), 1);
  assert.equal(destinationFromHash("#hablamos-claro"), 1);
  assert.equal(destinationFromHash("#proyectos"), 2);
  assert.equal(destinationFromHash("#contacto"), 3);
  assert.equal(destinationFromHash("#preguntas"), 3);
  assert.equal(destinationFromHash("#inicio"), -1);
});
test("route traverses three screens and finishes at contact", () => {
  assert.equal(nextDestination(-1, 1), 0);
  assert.equal(nextDestination(0, 1), 1);
  assert.equal(nextDestination(2, 1), 3);
  assert.equal(nextDestination(3, 1), 3);
  assert.equal(nextDestination(0, -1), -1);
});
test("reading takes priority and reverse scroll returns only at the top", () => {
  assert.equal(shouldLeavePanel(200, 500, 1200, 1), false);
  assert.equal(shouldLeavePanel(700, 500, 1200, 1), true);
  assert.equal(shouldLeavePanel(200, 500, 1200, -1), false);
  assert.equal(shouldLeavePanel(0, 500, 1200, -1), true);
});
