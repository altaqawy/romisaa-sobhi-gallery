/* V5.2 Design Review State Model — fictional orders, no network and no identity. */
(function(root,factory) {
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.RomisaaReviewCore=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const SEED=[
    {id:'SAMPLE-101',productId:'mirror-heart-gold',version:1,status:'proposed',log:[{version:1,action:'created',note:'مسودة أولى للمعاينة فقط'}]},
    {id:'SAMPLE-102',productId:'embroidered-wedding',version:2,status:'changes_requested',log:[{version:1,action:'created',note:'بداية النموذج'},{version:2,action:'created',note:'تم إنشاء تصور بديل تجريبي'},{version:2,action:'changes_requested',note:'مثال: تعديل توزيع الزخرفة'}]},
    {id:'SAMPLE-103',productId:'baby-set',version:1,status:'approved',log:[{version:1,action:'created',note:'تصور توضيحي لقطعة المولود'},{version:1,action:'approved',note:'موافقة تجريبية على النسخة الأولى'}]}
  ];
  const allowed=['proposed','changes_requested','approved','production','ready'];
  const actions=['created','changes_requested','approved','revised','production','ready'];
  const clean=s=>String(s??'').trim().slice(0,280);
  const clone=x=>JSON.parse(JSON.stringify(x));
  function defaults(){return{schema:1,records:clone(SEED)};}
  function normalize(data){
    if(!data||data.schema!==1||!Array.isArray(data.records))return defaults();
    const records=SEED.map(seed=>{
      const r=data.records.find(x=>x&&x.id===seed.id);
      if(!r||r.productId!==seed.productId||!Number.isInteger(r.version)||r.version<1||r.version>20||!allowed.includes(r.status)||!Array.isArray(r.log))return clone(seed);
      const log=r.log.slice(-35).filter(e=>e&&Number.isInteger(e.version)&&e.version>=1&&e.version<=r.version&&actions.includes(e.action)).map(e=>({version:e.version,action:e.action,note:clean(e.note)}));
      return {...seed,version:r.version,status:r.status,log:log.length?log:clone(seed.log)};
    });
    return{schema:1,records};
  }
  function apply(data,id,action,note=''){
    const state=normalize(data),idx=state.records.findIndex(r=>r.id===id);
    if(idx<0)throw Error('الطلب التجريبي غير موجود');
    const r=state.records[idx];const comment=clean(note);let label='';
    switch(action){
      case 'changes_requested':
        if(r.status!=='proposed')throw Error('ممكن طلب تعديل فقط على نسخة قيد المراجعة');
        if(comment.length<5)throw Error('اكتبي ملاحظة تعديل لا تقل عن 5 حروف');
        r.status='changes_requested';label='تم طلب تعديل تجريبي';break;
      case 'approved':
        if(r.status!=='proposed')throw Error('الموافقة تتطلب نسخة قيد المراجعة');
        r.status='approved';label='تمت الموافقة التجريبية على النسخة '+r.version;break;
      case 'revised':
        if(!['proposed','changes_requested','approved'].includes(r.status))throw Error('لا يمكن تعديل قطعة بدأ تنفيذها');
        if(r.version>=20)throw Error('وصل النموذج للحد الأقصى من النسخ');
        r.version++;r.status='proposed';
        label='نسخة جديدة '+r.version+'؛ أي موافقة قديمة لم تعد صالحة';break;
      case 'production':
        if(r.status!=='approved')throw Error('لا يبدأ التنفيذ قبل اعتماد النسخة الحالية');
        r.status='production';label='نقلنا النموذج التجريبي لمرحلة التنفيذ';break;
      case 'ready':
        if(r.status!=='production')throw Error('لا تصبح القطعة جاهزة إلا بعد مرحلة التنفيذ');
        r.status='ready';label='أصبحت القطعة الوهمية جاهزة';break;
      default:throw Error('حركة غير مدعومة');
    }
    r.log.push({version:r.version,action,note:comment||label});
    r.log=r.log.slice(-35);return{state,message:label};
  }
  return{SEED:clone(SEED),defaults,normalize,apply,statusLabels:{
    proposed:'بانتظار مراجعة التصميم',changes_requested:'مطلوب تعديل',approved:'نسخة معتمدة — تجريبي',
    production:'تجربة قيد التنفيذ',ready:'تجربة جاهزة'
  },actionLabels:{created:'إصدار أول',changes_requested:'طلب تعديل',approved:'اعتماد نسخة',revised:'إصدار جديد',production:'بدء التنفيذ',ready:'جاهزة'}};
});