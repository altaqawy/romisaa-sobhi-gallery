/* ROMISAA V5 ATELIER DESK — BROWSER-ONLY DEMONSTRATION.
 * No authentication, no customer information, no network requests, no transactions.
 * Changes live on this device only. Do not use as a production admin system.
 */
(function () {
  'use strict';
  const PRODUCTS = Array.isArray(window.ROMISAA_PRODUCTS) ? window.ROMISAA_PRODUCTS : [];
  const KEY = 'romisaa-v5-atelier-desk-demo-1';
  const STAGES = ['مسودة', 'مراجعة التصميم', 'جاهز للتنفيذ', 'جاري التنفيذ', 'جاهز للاستلام'];
  const SEED = [
    {id:'DEMO-101',product:'mirror-heart-gold',quantity:1,stage:0},
    {id:'DEMO-102',product:'embroidered-wedding',quantity:2,stage:1},
    {id:'DEMO-103',product:'baby-set',quantity:1,stage:2},
    {id:'DEMO-104',product:'cap-blue',quantity:3,stage:3},
    {id:'DEMO-105',product:'wedding-frame',quantity:1,stage:4}
  ];
  const el = id => document.getElementById(id);
  const safe = v => String(v == null ? '' : v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const cash = n => new Intl.NumberFormat('ar-EG', {maximumFractionDigits:0}).format(Number(n)||0)+' ج.م';
  const product = id => PRODUCTS.find(p=>p.id===id);
  const image = p => 'assets/'+encodeURIComponent(p.id)+'.webp';
  const cleanPrice = raw => {
    const n = Number(raw);
    return Number.isFinite(n) && n>=0 && n<=1000000 ? Math.round(n) : null;
  };
  const defaults=()=>({revision:1,overrides:{},orders:SEED.map(o=>Object.assign({},o))});
  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY)||'null');
      if (!raw || raw.revision !== 1 || !raw.overrides || !Array.isArray(raw.orders)) return defaults();
      const overrides={};
      PRODUCTS.forEach(p=>{
        const o=raw.overrides[p.id];
        if(!o || typeof o!=='object') return;
        overrides[p.id]={
          price:cleanPrice(o.price)===null?Number(p.price):cleanPrice(o.price),
          state:['draft','review','paused'].includes(o.state)?o.state:'draft'
        };
      });
      const orders=SEED.map(sample=>{
        const saved=raw.orders.find(o=>o.id===sample.id);
        return Object.assign({},sample,{stage:saved&&Number.isInteger(saved.stage)?Math.max(0,Math.min(4,saved.stage)):sample.stage});
      });
      return {revision:1,overrides,orders};
    } catch(e) {return defaults();}
  }
  let state=read(), query='',cat='all';
  function save(){
    try { localStorage.setItem(KEY,JSON.stringify(state)); } catch (e) {notify('تعذّر الحفظ المحلي؛ راجعي إعدادات المتصفح');}
    updateStats();
  }
  function notify(message){
    const n=el('desk-toast'); if(!n)return;
    n.textContent=message;n.classList.add('is-visible');
    if(notify.timer)clearTimeout(notify.timer);
    notify.timer=setTimeout(()=>n.classList.remove('is-visible'),2600);
  }
  function dataFor(p) {return state.overrides[p.id]||{price:Number(p.price),state:'draft'};}
  function updateStats(){
    el('stat-items').textContent=String(PRODUCTS.length);
    el('stat-reviewed').textContent=String(Object.values(state.overrides).filter(o=>o.state==='review').length);
    el('stat-orders').textContent=String(state.orders.filter(o=>o.stage<4).length);
    el('stat-finished').textContent=String(state.orders.filter(o=>o.stage===4).length);
  }
  function renderProducts(){
    const list=el('desk-products');
    const found=PRODUCTS.filter(p=>(cat==='all'||p.category===cat)&&[p.title,p.category,p.occasion].join(' ').toLowerCase().includes(query));
    el('found-count').textContent='عرض '+found.length+' من '+PRODUCTS.length+' قطعة';
    list.innerHTML=found.map(p=>{
      const o=dataFor(p);
      return '<article class="product-editor">'+
        '<img loading="lazy" src="'+safe(image(p))+'" alt="'+safe(p.title)+'">'+
        '<div><h3>'+safe(p.title)+'</h3><p>'+safe(p.category)+' · السعر الأصلي الظاهر بالموقع افتراضي</p>'+
        '<div class="product-controls">'+
        '<label class="field">سعر مسودة للتخطيط (جنيه)<input data-field="price" data-id="'+safe(p.id)+'" type="number" min="0" max="1000000" step="1" inputmode="numeric" value="'+o.price+'" aria-label="سعر مسودة '+safe(p.title)+'"></label>'+
        '<label class="field">حالة مراجعة البيانات<select data-field="state" data-id="'+safe(p.id)+'" aria-label="حالة '+safe(p.title)+'">'+
        '<option value="draft"'+(o.state==='draft'?' selected':'')+'>مسودة غير معتمدة</option>'+
        '<option value="review"'+(o.state==='review'?' selected':'')+'>جاهز للمراجعة</option>'+
        '<option value="paused"'+(o.state==='paused'?' selected':'')+'>معلّق</option>'+
        '</select></label></div></div></article>';
    }).join('');
    if(!found.length) list.innerHTML='<p class="empty">مفيش نتائج. جرّبي البحث باسم مختلف أو اختاري كل الفئات.</p>';
  }
  function renderBoard(){
    const headings=['طلبات في المراجعة','تجهيز وتنفيذ','جاهز للاستلام'];
    const groups=[
      state.orders.filter(o=>o.stage<=1),
      state.orders.filter(o=>o.stage===2||o.stage===3),
      state.orders.filter(o=>o.stage===4)
    ];
    el('desk-board').innerHTML=groups.map((items,i)=>{
      return '<section class="board-col" aria-label="'+headings[i]+'"><h3>'+headings[i]+' <span>'+items.length+'</span></h3>'+
      (items.length?items.map(o=>{
        const p=product(o.product);
        return '<article class="board-order"><b>'+safe(o.id)+'</b><small>'+safe(STAGES[o.stage])+'</small>'+
        '<p>'+safe(p?p.title:'منتج تجريبي')+' × '+o.quantity+'</p>'+
        (o.stage<4?'<button data-next="'+safe(o.id)+'" type="button">المرحلة التالية ←</button>':'<small>انتهت المراحل التجريبية ✓</small>')+
        '</article>';
      }).join(''):'<div class="empty">لا توجد مسودات هنا</div>')+'</section>';
    }).join('');
  }
  function renderQuote(){
    const id=el('quote-product').value;
    const p=product(id)||PRODUCTS[0];
    if(!p)return;
    const qty=Math.max(1,Math.min(99,Math.floor(Number(el('quote-qty').value)||1)));
    const extra=cleanPrice(el('quote-extra').value);
    const delivery=cleanPrice(el('quote-delivery').value);
    const valid=(extra!==null&&delivery!==null);
    const price=dataFor(p).price,subtotal=price*qty;
    el('quote-total').textContent=valid?cash(subtotal+extra+delivery):'راجعي المدخلات';
    const notes=el('quote-notes').value.trim().slice(0,250);
    const draft=[
      'مسودة عرض سعر — Romisaa Sobhi Gallery',
      'ليست فاتورة أو سعرًا معتمدًا',
      'القطعة: '+p.title,
      'الكمية: '+qty,
      'سعر القطعة الافتراضي/المسودة: '+cash(price),
      'الإضافات المقترحة: '+cash(extra||0),
      'الشحن التقديري: '+cash(delivery||0),
      'الإجمالي التقريبي: '+(valid?cash(subtotal+extra+delivery):'غير محسوب'),
      notes?'ملحوظات: '+notes:'',
      'بانتظار تأكيد السعر وموعد التنفيذ من الجاليري.'
    ].filter(Boolean).join('\n');
    el('quote-output').textContent=draft;
    el('copy-quote').disabled=!valid;
  }
  function exportJson(){
    const data={
      format:'romisaa-v5-desk-preview',
      version:1,
      warning:'LOCAL DEMO ONLY; NOT verified product prices, inventory or customer orders',
      createdAt:new Date().toISOString(),
      productDrafts:PRODUCTS.map(p=>({
        id:p.id,title:p.title,category:p.category,
        demoCatalogPrice:Number(p.price),
        draftPrice:dataFor(p).price,
        reviewState:dataFor(p).state
      })),
      fictionalSampleOrders:state.orders.map(o=>Object.assign({},o))
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='romisaa-v5-browser-drafts.json';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
    notify('تم تنزيل مسودة JSON على جهازك');
  }
  function bind(){
    document.querySelectorAll('[role=tab]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',String(b===btn)));
        document.querySelectorAll('[role=tabpanel]').forEach(p=>p.hidden=p.id!==btn.getAttribute('aria-controls'));
      });
    });
    const categories=[...new Set(PRODUCTS.map(p=>p.category))];
    el('desk-category').innerHTML='<option value="all">كل الفئات</option>'+categories.map(c=>'<option value="'+safe(c)+'">'+safe(c)+'</option>').join('');
    el('desk-category').addEventListener('change',e=>{cat=e.target.value;renderProducts();});
    el('desk-search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderProducts();});
    el('desk-products').addEventListener('change',e=>{
      const id=e.target.dataset.id,field=e.target.dataset.field;
      const p=product(id);if(!p||!['price','state'].includes(field))return;
      const prev=dataFor(p),next={price:prev.price,state:prev.state};
      if(field==='price'){
        const n=cleanPrice(e.target.value);
        if(n===null){e.target.value=prev.price;notify('اكتبي رقمًا صالحًا بين 0 ومليون');return;}
        next.price=n;
      }else{
        if(!['draft','review','paused'].includes(e.target.value))return;
        next.state=e.target.value;
      }
      state.overrides[id]=next;save();notify('اتحفظت المسودة على المتصفح ده فقط');renderQuote();
    });
    el('desk-board').addEventListener('click',e=>{
      const btn=e.target.closest('[data-next]');if(!btn)return;
      const order=state.orders.find(o=>o.id===btn.dataset.next);if(!order||order.stage>=4)return;
      order.stage++;save();renderBoard();notify('تم تحديث حالة الطلب الوهمي فقط');
    });
    el('reset-demo').addEventListener('click',()=>{
      if(!window.confirm('إرجاع المسودات والطلبات الوهمية للحالة الأولى على هذا الجهاز فقط؟'))return;
      state=defaults();save();renderBoard();renderProducts();renderQuote();notify('تمت استعادة البيانات التجريبية');
    });
    el('export-drafts').addEventListener('click',exportJson);
    el('quote-product').innerHTML=PRODUCTS.map(p=>'<option value="'+safe(p.id)+'">'+safe(p.title)+'</option>').join('');
    ['quote-product','quote-qty','quote-extra','quote-delivery','quote-notes'].forEach(id=>{
      el(id).addEventListener('input',renderQuote);el(id).addEventListener('change',renderQuote);
    });
    el('copy-quote').addEventListener('click',async()=>{
      const text=el('quote-output').textContent;
      try {await navigator.clipboard.writeText(text);notify('تم نسخ مسودة عرض السعر');}
      catch(e) {notify('تعذّر النسخ التلقائي، يمكن تحديد النص ونسخه');}
    });
    document.addEventListener('keydown',e=>{
      if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
      const active=document.activeElement;if(!active||active.getAttribute('role')!=='tab')return;
      const tabs=[...document.querySelectorAll('[role=tab]')],i=tabs.indexOf(active);
      const next=tabs[(i+(e.key==='ArrowLeft'?1:-1)+tabs.length)%tabs.length];
      next.focus();next.click();e.preventDefault();
    });
  }
  if(!PRODUCTS.length){el('desk-main').innerHTML='<div class="empty">لم يتم تحميل كتالوج المنتجات؛ أعيدي فتح الصفحة.</div>';return;}
  bind();renderProducts();renderBoard();updateStats();renderQuote();
})();