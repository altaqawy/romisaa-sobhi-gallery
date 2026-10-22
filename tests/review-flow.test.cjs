/* V5.2 review model regression tests — run: node tests/review-flow.test.cjs */
const assert = require('node:assert/strict');
const core = require('../assets/v5-review-core.js');
let cases = 0;
function test(name,fn){fn(); cases++; console.log('PASS',name)}
function step(s,a,n=''){return core.apply(s,'SAMPLE-101',a,n).state;}
test('seed is fictional and deterministic',()=>{const a=core.defaults();assert.equal(a.records.length,3);assert.equal(a.records[0].id,'SAMPLE-101');});
test('review approval applies to current version',()=>{const a=step(core.defaults(),'approved');assert.equal(a.records[0].status,'approved');assert.equal(a.records[0].version,1);});
test('revision invalidates approval',()=>{const a=step(step(core.defaults(),'approved'),'revised');assert.equal(a.records[0].status,'proposed');assert.equal(a.records[0].version,2);});
test('cant start without valid approval',()=>{assert.throws(()=>step(core.defaults(),'production'));});
test('cant approve once changes requested',()=>{const a=step(core.defaults(),'changes_requested','تغيير لون الخيوط');assert.throws(()=>step(a,'approved'));});
test('requires meaningful change note',()=>{assert.throws(()=>step(core.defaults(),'changes_requested','abc'));});
test('can revise and approve after feedback',()=>{const a=step(step(core.defaults(),'changes_requested','تغيير لون الخيوط'),'revised');assert.equal(step(a,'approved').records[0].status,'approved');});
test('can start and finish approved sample',()=>{const s=step(step(step(core.defaults(),'approved'),'production'),'ready');assert.equal(s.records[0].status,'ready');});
test('cant revise after production begins',()=>{const s=step(step(core.defaults(),'approved'),'production');assert.throws(()=>step(s,'revised'));});
test('cant claim ready before production',()=>{assert.throws(()=>step(core.defaults(),'ready'));});
test('unauthorized fictional ID is rejected',()=>{assert.throws(()=>core.apply(core.defaults(),'CUSTOMER-REAL','approved'));});
test('tampered stored record falls back to default',()=>{const s=core.defaults();s.records[0].productId='unknown';s.records[1].version=999;const c=core.normalize(s);assert.equal(c.records[0].productId,core.SEED[0].productId);assert.equal(c.records[1].version,2);});
test('notes limited to 280 chars',()=>{const s=step(core.defaults(),'changes_requested','x'.repeat(1000));assert.equal(s.records[0].log.at(-1).note.length,280);});
console.log('All '+cases+' V5.2 workflow tests passed.');
