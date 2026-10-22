/* ROMISAA V6.0 / V6.1 — real-work editorial gallery.
   Native static frontend. No backend, no payments, no AI-concept products.
   No proprietary React Bits source. */
(()=>{
'use strict';
const root=document.getElementById('v6-gallery');
if(!root)return;
const $=(selector,context=root)=>context.querySelector(selector);
const $$=(selector,context=root)=>Array.from(context.querySelectorAll(selector));
const P=(Array.isArray(window.ROMISAA_PRODUCTS)?window.ROMISAA_PRODUCTS:[]).filter(p=>p&&/^[a-z0-9-]+$/.test(p.id));
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const photo=p=>'assets/'+encodeURIComponent(p.id)+'.webp';
const productUrl=p=>'product.html?id='+encodeURIComponent(p.id);
let category='all',mode='editorial',shown=[],active=0,railIndex=0,returnFocus=null,animationFrame=0;
const tags={ 'مرايات':'MIRROR EDIT','تطريز':'STITCH STORIES','إكسسوارات':'HANDMADE ACCESSORIES','مناسبات':'OCCASION EDIT','مواليد':'BABY KEEPSAKES','هدايا وديكور':'OBJECTS OF AFFECTION'};
const categories=['all',...new Set(P.map(p=>p.category))];
function card(p,index){
  return '<article class="v6-item v6-float-reveal" data-v6-id="'+esc(p.id)+'">'+
    '<div class="v6-image">'+
    '<img loading="lazy" decoding="async" src="'+photo(p)+'" alt="'+esc(p.title)+'">'+
    '<button type="button" data-v6-open="'+esc(p.id)+'" aria-label="تكبير صورة '+esc(p.title)+'">مشاهدة عن قرب ↗</button></div>'+
    '<div class="v6-item-content"><div><small>'+String(index+1).padStart(2,'0')+' / '+esc(tags[p.category]||'ROMISAA COLLECTION')+
    '</small><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p></div>'+
    '<a href="'+productUrl(p)+'" aria-label="تفاصيل '+esc(p.title)+'">التفاصيل ↗</a></div></article>';
}
function markCurrent(){
  $$('.v6-filter').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v6Category===category)));
  $$('.v6-mode').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v6Mode===mode)));
  ['editorial','rail','detail'].forEach(name=>{
    const el=$('#v6-panel-'+name);el.hidden=name!==mode;
  });
  $('#v6-count').textContent=shown.length+' قطع من أعمال الجاليري';
  const headings={editorial:'مجلة روميساء المصوّرة',rail:'اتحركي بين القطع',detail:'قرّبي من التفاصيل'};
  $('#v6-mode-heading').textContent=headings[mode];
}
function rebuildReveal(){
  const nodes=$$('.v6-float-reveal');
  if(reduced||!('IntersectionObserver' in window)){
    nodes.forEach(el=>el.classList.add('v6-shown'));return;
  }
  document.documentElement.classList.add('v6-motion-ready');
  const ob=new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('v6-shown');ob.unobserve(entry.target);}
  },{threshold:.08,rootMargin:'0px 0px 70px 0px'});
  nodes.forEach(el=>ob.observe(el));
}
function render(){
  shown=category==='all'?P.slice():P.filter(p=>p.category===category);
  if(active>=shown.length)active=0;
  railIndex=0;
  $('#v6-panel-editorial').innerHTML=shown.map(card).join('')||'<p class="v6-empty">مافيش صور متاحة للفئة دي.</p>';
  $('#v6-rail').innerHTML=shown.map(card).join('')||'<p class="v6-empty">مافيش صور متاحة.</p>';
  markCurrent();renderDetail();updateRail();
  if(mode==='rail')$$('.v6-item','#v6-rail');
  rebuildReveal();
}
function setMode(name){
  if(!['editorial','rail','detail'].includes(name))return;
  mode=name;markCurrent();
  if(name==='rail'){
    railIndex=0;
    const first=$('.v6-item',$('#v6-rail'));if(first)first.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'});
    updateRail();
  }
  if(name==='detail')renderDetail();
}
function updateRail(){
  const rail=$('#v6-rail'),cards=$$('.v6-item',rail);
  if(!cards.length){$('#v6-rail-counter').textContent='00 / 00';return;}
  const rect=rail.getBoundingClientRect();
  const center=rect.left+rect.width/2;let best=0,distance=Infinity;
  cards.forEach((card,i)=>{
    const box=card.getBoundingClientRect(),current=Math.abs(box.left+box.width/2-center);
    if(current<distance){distance=current;best=i;}
  });
  railIndex=best;
  cards.forEach((card,i)=>card.classList.toggle('is-focused',i===best));
  $('#v6-rail-counter').textContent=String(best+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
  $('#v6-rail-fill').style.width=(((best+1)/cards.length)*100)+'%';
  $('#v6-rail-prev').disabled=best===0;
  $('#v6-rail-next').disabled=best===cards.length-1;
}
function moveRail(delta){
  const cards=$$('.v6-item',$('#v6-rail'));
  const index=Math.max(0,Math.min(cards.length-1,railIndex+delta));
  if(cards[index])cards[index].scrollIntoView({behavior:reduced?'instant':'smooth',inline:'center',block:'nearest'});
}
function renderDetail(){
  if(!shown.length){
    $('#v6-detail-stage').hidden=true;$('#v6-detail-title').textContent='لا توجد قطع';return;
  }
  const p=shown[active]||shown[0],stage=$('#v6-detail-stage'),img=$('#v6-detail-image');
  stage.hidden=false;stage.classList.remove('is-zoomed');
  img.src=photo(p);img.alt=p.title;
  $('#v6-detail-label').textContent=tags[p.category]||'ROMISAA ARTISAN WORK';
  $('#v6-detail-title').textContent=p.title;
  $('#v6-detail-description').textContent=p.summary+' — الصورة من أعمال الجاليري. زوايا تصوير إضافية تتطلب تصوير المنتج فعليًا.';
  $('#v6-detail-link').href=productUrl(p);
  $('#v6-detail-index').textContent=String(active+1).padStart(2,'0')+' / '+String(shown.length).padStart(2,'0');
  $('#v6-detail-thumbs').innerHTML=shown.map((x,i)=>
    '<button class="v6-mini" type="button" data-v6-select="'+esc(x.id)+'" aria-label="عرض '+esc(x.title)+'" aria-pressed="'+String(i===active)+'"><img loading="lazy" alt="" src="'+photo(x)+'"></button>'
  ).join('');
}
function selectDetail(id){
  const n=shown.findIndex(p=>p.id===id);if(n<0)return;
  active=n;renderDetail();
}
function detailStep(d){
  if(!shown.length)return;active=(active+d+shown.length)%shown.length;renderDetail();
}
function openLightbox(id){
  const i=shown.findIndex(p=>p.id===id);if(i<0)return;
  active=i;returnFocus=document.activeElement;
  const box=$('#v6-lightbox');box.hidden=false;document.body.classList.add('v6-no-scroll');
  refreshLightbox();$('#v6-lightbox-close').focus();
}
function refreshLightbox(){
  const p=shown[active];if(!p)return;
  $('#v6-lightbox-image').src=photo(p);
  $('#v6-lightbox-image').alt=p.title;
  $('#v6-lightbox-caption').textContent=p.title;
  $('#v6-lightbox-counter').textContent=String(active+1).padStart(2,'0')+' / '+String(shown.length).padStart(2,'0');
  $('#v6-lightbox-link').href=productUrl(p);
}
function closeLightbox(){
  $('#v6-lightbox').hidden=true;document.body.classList.remove('v6-no-scroll');
  if(returnFocus?.isConnected)returnFocus.focus();
}
function lightboxStep(d){if(!shown.length)return;active=(active+d+shown.length)%shown.length;refreshLightbox();}
$$('.v6-filter').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.v6Category;render()}));
$$('.v6-mode').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.v6Mode)));
root.addEventListener('click',ev=>{
  const opener=ev.target.closest('[data-v6-open]');if(opener){openLightbox(opener.dataset.v6Open);return;}
  const mini=ev.target.closest('[data-v6-select]');if(mini){selectDetail(mini.dataset.v6Select);return;}
});
$('#v6-rail').addEventListener('scroll',()=>{
  if(animationFrame)cancelAnimationFrame(animationFrame);
  animationFrame=requestAnimationFrame(()=>{animationFrame=0;updateRail();});
},{passive:true});
$('#v6-rail-prev').addEventListener('click',()=>moveRail(-1));
$('#v6-rail-next').addEventListener('click',()=>moveRail(1));
$('#v6-detail-prev').addEventListener('click',()=>detailStep(-1));
$('#v6-detail-next').addEventListener('click',()=>detailStep(1));
$('#v6-detail-stage').addEventListener('pointermove',ev=>{
  if(reduced||ev.pointerType==='touch')return;
  const stage=ev.currentTarget,rect=stage.getBoundingClientRect();
  stage.style.setProperty('--v6-lens-x',Math.max(0,Math.min(100,((ev.clientX-rect.left)/rect.width)*100))+'%');
  stage.style.setProperty('--v6-lens-y',Math.max(0,Math.min(100,((ev.clientY-rect.top)/rect.height)*100))+'%');
},{passive:true});
$('#v6-detail-stage').addEventListener('click',ev=>{
  if(reduced)return;
  if(ev.target.closest('#v6-detail-full')){openLightbox(shown[active].id);return;}
  ev.currentTarget.classList.toggle('is-zoomed');
});
$('#v6-lightbox-close').addEventListener('click',closeLightbox);
$('#v6-lightbox-prev').addEventListener('click',()=>lightboxStep(-1));
$('#v6-lightbox-next').addEventListener('click',()=>lightboxStep(1));
$('#v6-lightbox').addEventListener('click',ev=>{if(ev.target===ev.currentTarget)closeLightbox();});
document.addEventListener('keydown',ev=>{
  const box=$('#v6-lightbox');if(box.hidden)return;
  if(ev.key==='Escape'){ev.preventDefault();closeLightbox();return;}
  if(ev.key==='ArrowRight'){ev.preventDefault();lightboxStep(-1);return;}
  if(ev.key==='ArrowLeft'){ev.preventDefault();lightboxStep(1);return;}
  if(ev.key==='Tab'){
    const controls=$$('button:not([disabled]),a[href]',box);
    if(!controls.length)return;
    const first=controls[0],last=controls[controls.length-1];
    if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus();}
    else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus();}
  }
});
/* Mouse dragging without hijacking links or touch scrolling. */
const rail=$('#v6-rail');let drag=null,suppressClick=false;
rail.addEventListener('pointerdown',ev=>{
  if(ev.pointerType==='touch'||ev.button!==0||ev.target.closest('button,a'))return;
  drag={x:ev.clientX,scrollLeft:rail.scrollLeft,moved:false};
});
rail.addEventListener('pointermove',ev=>{
  if(!drag)return;
  const delta=ev.clientX-drag.x;if(Math.abs(delta)>7)drag.moved=true;
  if(drag.moved){rail.scrollLeft=drag.scrollLeft-delta;rail.style.scrollSnapType='none';}
});
function finishDrag(){if(!drag)return;if(drag.moved)suppressClick=true;drag=null;rail.style.scrollSnapType='';setTimeout(()=>{suppressClick=false},100);}
rail.addEventListener('pointerup',finishDrag);rail.addEventListener('pointercancel',finishDrag);
rail.addEventListener('click',ev=>{if(suppressClick){ev.preventDefault();ev.stopPropagation();}},true);
render();setMode('editorial');
})();
