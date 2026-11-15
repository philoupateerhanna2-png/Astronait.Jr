import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../js/data/missions.js';
import { CONTENT_RECORDS, getContentRecord, validateContentRecords } from '../js/data/content-records.js';

test('all 15 missions have complete educational content records', () => {
  assert.equal(CONTENT_RECORDS.length, 15);
  assert.deepEqual(validateContentRecords(STAGES), []);
  for (const stage of STAGES) assert.ok(getContentRecord(stage.id));
});

test('every mission record has an objective, misconceptions, and official source links', () => {
  for (const record of CONTENT_RECORDS) {
    assert.ok(record.learningObjective.length > 20);
    assert.ok(record.misconceptionToAddress.length >= 1);
    assert.ok(record.sourceUrls.length >= 1);
    assert.ok(record.sourceUrls.every(url => /^https:\/\//.test(url)));
    assert.equal(record.scientificReview.status, 'Pending knowledgeable human reviewer');
    assert.equal(record.claimTraceability.status, 'Source mapping supplied; sentence-level audit pending');
  }
});

test('all quiz questions have one indexed answer, hint, and explanation', () => {
  for (const stage of STAGES) for (const q of stage.quiz) {
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length);
    assert.ok(q.hint?.trim());
    assert.ok(q.explain?.trim());
    assert.equal(new Set(q.options.map(x => x.trim().toLowerCase())).size, q.options.length);
  }
});
