/* Run: node tests/gift-card.test.cjs */
const assert=require('node:assert/strict');
const core=require('../assets/v5-gift-core.js');
let count=0;
function test(name,fn){fn();count++;console.log('PASS',name);}
test('three whitelisted styles',()=>assert.deepEqual(Object.keys(core.THEMES),['pearl','rose','night']));
test('six supported occasions',()=>assert.equal(core.OCCASIONS.length,6));
test('unknown template falls back safely',()=>assert.equal(core.normalize({theme:'<script>'}).theme,'pearl'));
test('short message cannot be printed',()=>assert.equal(core.validate({message:'اه'}).ok,false));
test('sufficient Arabic message accepted',()=>assert.equal(core.validate({message:'ألف مبروك على المناسبة الجميلة'}).ok,true));
test('message limited to 240 chars',()=>assert.equal(core.normalize({message:'س'.repeat(500)}).message.length,240));
test('recipient and sender limited to 40 chars',()=>{const a=core.normalize({recipient:'r'.repeat(90),sender:'s'.repeat(90)});assert.equal(a.recipient.length,40);assert.equal(a.sender.length,40);});
test('raw markup escaped in downloaded SVG',()=>{const a=core.svg({message:'رسالة هدية جميلة جدًا',recipient:'<svg onload="alert(1)">' ,sender:'&OK'});assert.ok(!a.includes('<svg onload'));assert.ok(a.includes('&lt;svg onload'));assert.ok(a.includes('&amp;OK'));});
test('valid SVG has 700x970 layout',()=>assert.ok(core.svg({message:'الذكريات الحلوة بتعيش للأبد'}).includes('width="700" height="970"')));
test('all 240 characters preserved by wrapper',()=>{const long='ب'.repeat(240);const lines=core.wrap(long,32,10);assert.equal(lines.join('').length,240);assert.ok(lines.every(l=>l.length<=32));});
test('regular text line wrapping preserves words',()=>{const msg='كل سنة وأنتِ طيبة يا أجمل صديقة في العالم';const parts=core.wrap(msg,32,10);assert.equal(parts.join(' '),msg);});
test('no private message in template defaults',()=>{const a=core.normalize({});assert.equal(a.message,'');});
test('only local quote output contains label',()=>assert.ok(core.messageText({message:'هدية مخصوصة وشكر كبير'}).includes('غير مرتبط بطلب شراء')));
console.log('All '+count+' gift studio tests passed.');
