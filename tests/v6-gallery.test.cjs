/* Romisaa V6.1 — dependency-free gallery regression.
 * Run node tests/v6-gallery.test.cjs
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('gallery.html'),catalog=read('assets/catalog.js'),gallery=read('assets/v6-gallery.js');
const css=read('assets/v6-gallery.css'),motion=read('assets/v6-motion.js');
const elements={},handlers={};let assertions=0;
function check(name,fn){fn();assertions++;console.log('PASS',name)}
for(const m of html.matchAll(/\bid="([^"]+)"/g)){
  const id=m[1];
  elements[id]={
    id,hidden:false,innerHTML:'',textContent:'',src:'',alt:'',href:'',dataset:{},disabled:false,
    style:{width:'',setProperty(){}},
    classList:{add(){},remove(){},toggle(){}},
    scrollIntoView(){},focus(){},
    addEventListener(type,callback){handlers[id+'_'+type]=callback},
    setAttribute(k,v){this[k]=v},getBoundingClientRect(){return{left:0,width:500}},
    querySelectorAll(){return[]},querySelector(){return null}
  };
}
const makeButton=(kind,value)=>({
  dataset:{[kind]:value},
  addEventListener(type,callback){handlers[kind+'_'+value+'_'+type]=callback},
  setAttribute(k,v){this[k]=v},classList:{add(){},remove(){}}
});
const modes=['editorial','rail','detail'].map(x=>makeButton('v6Mode',x));
const filters=['all','مرايات','تطريز','إكسسوارات','مناسبات','مواليد','هدايا وديكور'].map(x=>makeButton('v6Category',x));
const container=elements['v6-gallery'];
container.querySelector=s=>s.startsWith('#')?elements[s.slice(1)]:null;
container.querySelectorAll=s=>s==='.v6-mode'?modes:s==='.v6-filter'?filters:[];
container.addEventListener=(type,cb)=>handlers['root_'+type]=cb;
const doc={
  getElementById:id=>elements[id]||null,activeElement:null,
  documentElement:{classList:{add(){}}},
  body:{classList:{add(){},remove(){}}},
  addEventListener(type,cb){handlers['doc_'+type]=cb}
};
const win={ROMISAA_PRODUCTS:[],matchMedia(){return{matches:true}},addEventListener(){}};
check('gallery, motion and catalogue scripts parse',()=>{
  [gallery,motion,catalog].forEach(s=>assert.doesNotThrow(()=>new Function(s)));
});
new Function('window',catalog)(win);
check('catalogue includes 18 verified-photo entries',()=>assert.equal(win.ROMISAA_PRODUCTS.length,18));
check('gallery includes accessible dialog and three controls',()=>{
  assert.match(html,/aria-modal="true"/);
  assert.equal((html.match(/data-v6-mode=/g)||[]).length,3);
  assert.match(html,/assets\/v6-gallery\.css/);
  assert.match(html,/assets\/v6-motion\.js/);
  assert.match(css,/prefers-reduced-motion/);
});
check('gallery script boots without third-party dependencies',()=>{
  assert.doesNotThrow(()=>new Function('document','window','requestAnimationFrame','cancelAnimationFrame','setTimeout','IntersectionObserver',gallery)(
    doc,win,()=>0,()=>{},()=>{},undefined
  ));
});
const count=markup=>(markup.match(/class="v6-item /g)||[]).length;
check('all catalogue images appear in editorial view',()=>assert.equal(count(elements['v6-panel-editorial'].innerHTML),18));
check('filter matches exactly 5 embroidery products',()=>{
  handlers['v6Category_تطريز_click']();
  assert.equal(count(elements['v6-panel-editorial'].innerHTML),5);
  assert.match(elements['v6-count'].textContent,/5 قطع/);
});
check('horizontal gallery mode is selectable',()=>{
  handlers['v6Mode_rail_click']();
  assert.equal(elements['v6-panel-rail'].hidden,false);
  assert.equal(elements['v6-panel-editorial'].hidden,true);
});
check('detail mode shows valid product with thumbnails',()=>{
  handlers['v6Mode_detail_click']();
  assert.equal(elements['v6-panel-detail'].hidden,false);
  assert.equal((elements['v6-detail-thumbs'].innerHTML.match(/class="v6-mini"/g)||[]).length,5);
});
check('lightbox opens and closes with product data',()=>{
  handlers['root_click']({target:{closest:sel=>sel==='[data-v6-open]'?{dataset:{v6Open:'wedding-hoop'}}:null}});
  assert.equal(elements['v6-lightbox'].hidden,false);
  assert.equal(elements['v6-lightbox-caption'].textContent,'منديل ذكرى الزفاف');
  handlers['v6-lightbox-close_click']();
  assert.equal(elements['v6-lightbox'].hidden,true);
});
check('every dynamic id reference has an HTML counterpart',()=>{
  const ids=[...new Set([...gallery.matchAll(/\$\('#([^']+)'\)/g)].map(m=>m[1]))];
  assert.deepEqual(ids.filter(id=>!elements[id]),[]);
});
check('only vetted local .webp paths used for catalogue photos',()=>{
  assert.match(gallery,/assets\/.*\.webp/);
  assert.match(gallery,/a-z0-9-/);
  assert.doesNotMatch(gallery,/\bfetch\s*\(|sendBeacon\s*\(/);
});
console.log('V6.1: '+assertions+' gallery checks passed');
