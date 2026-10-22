/* Romisaa V5.2 — DEMONSTRATION UI. The records are fictional and local to this browser. */
(function(){
'use strict';
const core=window.RomisaaReviewCore,products=window.ROMISAA_PRODUCTS||[],KEY='romisaa-v5-review-demo-v1';
const e=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const photo=id=>'assets/'+encodeURIComponent(id)+'.webp';
let data=core.defaults(),selected='SAMPLE-101',hasStorage=true;
try{data=core.normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(err){hasStorage=false;}
function persist(){
  try{localStorage.setItem(KEY,JSON.stringify(data));hasStorage=true;}
  catch(err){hasStorage=false;toast('التغييرات في الذاكرة مؤقتًا؛ تعذّر الحفظ في المتصفح');}
}
function toast(text){
  const node=e('rv-toast');node.textContent=text;node.classList.add('on');
  clearTimeout(toast.handle);toast.handle=setTimeout(()=>node.classList.remove('on'),3400);
}
function current(){return data.records.find(r=>r.id===selected);}
function product(id){return products.find(p=>p.id===id);}
function render(){
  const r=current(),p=product(r.productId);
  if(!p)return;
  e('rv-product-title').textContent=p.title;
  e('rv-product-desc').textContent=p.summary||'قطعة توضيحية من الأعمال المرسلة';
  e('rv-version').textContent='التصور رقم '+String(r.version).padStart(2,'0');
  e('rv-status').textContent=core.statusLabels[r.status];
  e('rv-image-current').src=photo(p.id);e('rv-image-current').alt='صورة المنتج: '+p.title;
  e('rv-image-prev').src=photo(p.id);e('rv-image-prev').alt='معالجة بصرية توضيحية للصورة نفسها، وليست نسخة سابقة حقيقية';
  e('rv-demo-id').textContent=r.id;
  const steps=[['التصميم','proposed'],['الموافقة','approved'],['التنفيذ','production'],['الجاهزية','ready']];
  const currentIndex=r.status==='changes_requested'?0:['proposed','approved','production','ready'].indexOf(r.status);
  e('rv-progress').innerHTML=steps.map((step,i)=>
    '<div class="rv-step" data-active="'+(i===currentIndex)+'" data-complete="'+(i<currentIndex)+'">'+
    '<span class="rv-step-circle">'+(i<currentIndex?'✓':i+1)+'</span>'+
    '<span class="rv-step-label">'+esc(step[0])+'</span></div>').join('');
  e('rv-history').innerHTML=[...r.log].reverse().map(event=>
    '<div class="rv-event"><b>'+esc(core.actionLabels[event.action]||event.action)+
    ' — نسخة '+esc(event.version)+'</b>'+
    '<small>'+esc(event.note||'حدث تجريبي')+'</small></div>').join('');
  const buttons=[
    ['rv-btn-approve',r.status==='proposed'],
    ['rv-btn-changes',r.status==='proposed'],
    ['rv-btn-revise',['proposed','changes_requested','approved'].includes(r.status)&&r.version<20],
    ['rv-btn-prod',r.status==='approved'],
    ['rv-btn-ready',r.status==='production']
  ];
  buttons.forEach(([id,enabled])=>{e(id).disabled=!enabled;});
  e('rv-summary').textContent='مثال '+r.id+' | '+p.title+' | نسخة '+r.version+' | '+core.statusLabels[r.status]+'.';
  e('rv-storage-note').textContent=hasStorage?'البيانات الوهمية محفوظة محليًا على هذا المتصفح فقط.':'الحفظ المحلي غير متاح؛ التغييرات مؤقتة.';
}
function change(action){
  try{
    const result=core.apply(data,selected,action,e('rv-note').value);
    data=result.state;e('rv-note').value='';persist();render();toast(result.message);
  }catch(err){toast(err.message||'حصل خطأ في الحالة التجريبية');}
}
e('rv-select').innerHTML=data.records.map(r=>{
  const p=product(r.productId);
  return '<option value="'+esc(r.id)+'">'+esc(r.id)+' — '+esc(p?p.title:r.productId)+'</option>';
}).join('');
e('rv-select').value=selected;e('rv-select').addEventListener('change',event=>{
  selected=event.target.value;e('rv-note').value='';render();
});
[['rv-btn-approve','approved'],['rv-btn-changes','changes_requested'],['rv-btn-revise','revised'],['rv-btn-prod','production'],['rv-btn-ready','ready']].forEach(([id,action])=>e(id).addEventListener('click',()=>change(action)));
e('rv-btn-reset').addEventListener('click',()=>{
  if(!window.confirm('ترجعي كل الأمثلة والقرارات الوهمية لبدايتها على جهازك فقط؟'))return;
  data=core.defaults();selected=data.records[0].id;e('rv-select').value=selected;
  e('rv-note').value='';persist();render();toast('تمت إعادة ضبط التجربة على هذا الجهاز');
});
e('rv-btn-copy').addEventListener('click',async()=>{
  const text=e('rv-summary').textContent+'\nتنبيه: هذه محاكاة غير مرتبطة بطلب أو موافقة حقيقية.';
  try{await navigator.clipboard.writeText(text);toast('تم نسخ الملخص التجريبي');}
  catch(err){toast('تعذّر النسخ التلقائي، يمكن تحديد الملخص ونسخه');}
});
render();
})();