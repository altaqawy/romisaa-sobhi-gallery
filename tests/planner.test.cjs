/* V5.3 date-only planning regression tests: node tests/planner.test.cjs */
const assert=require('node:assert/strict');
const {parseDate,compute}=require('../assets/v5-planner.js');
const input=(event,production=10,shipping=3,buffer=3)=>({start:'2026-10-22',event,production,shipping,buffer});
assert.equal(parseDate('2026-02-29'),null,'invalid non-leap date');
assert.ok(parseDate('2028-02-29')!==null,'valid leap date');
assert.equal(compute(input('2026-11-07')).slack,0,'exactly ready');
assert.equal(compute(input('2026-11-06')).slack,-1,'one day late');
assert.equal(compute(input('2026-11-09')).slack,2,'two day buffer');
assert.equal(compute({start:'2026-12-30',event:'2027-01-05',production:2,shipping:2,buffer:1}).ready,'2027-01-04','year boundary');
assert.throws(()=>compute(input('2026-11-22',0)),'no zero-day production');
assert.throws(()=>compute(input('2026-11-22',3,-1)),'no negative shipping');
assert.throws(()=>compute(input('2026-11-22',3,1.5)),'no fractional shipping');
assert.throws(()=>compute(input('not-a-date')),'reject missing date');
console.log('10 V5.3 planning tests passed');
