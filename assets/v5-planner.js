/* Romisaa V5.3: scheduling arithmetic demo. NOT a reservation, capacity check, or confirmed delivery estimate. */
(function(root){
'use strict';
const DAY=86400000;
function parseDate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value)))return null;
  const [y,m,d]=value.split('-').map(Number);
  const ms=Date.UTC(y,m-1,d);
  if(!Number.isFinite(ms))return null;
  const check=new Date(ms);
  if(check.getUTCFullYear()!==y||check.getUTCMonth()+1!==m||check.getUTCDate()!==d)return null;
  return ms;
}
function formatISO(ms){return new Date(ms).toISOString().slice(0,10);}
function days(v,max=120){const n=Number(v);return Number.isSafeInteger(n)&&n>=0&&n<=max?n:null;}
function compute(o){
  const start=parseDate(o.start),event=parseDate(o.event);
  const prod=days(o.production),ship=days(o.shipping),buffer=days(o.buffer);
  if(start===null||event===null||prod===null||ship===null||buffer===null)throw Error('راجعي التواريخ والمدد؛ الأرقام لازم تكون صحيحة.');
  if(prod<1)throw Error('حددي يومًا واحدًا على الأقل للتنفيذ التجريبي.');
  const stages=[{name:'بداية تقديرية',date:start},{name:'نهاية التنفيذ الافتراضية',date:start+prod*DAY},{name:'بعد التوصيل الافتراضي',date:start+(prod+ship)*DAY},{name:'بعد هامش الأمان',date:start+(prod+ship+buffer)*DAY}];
  const final=stages[3].date;
  const slack=Math.round((event-final)/DAY);
  return {ok:slack>=0,slack,stages,ready:formatISO(final),event:formatISO(event),total:prod+ship+buffer};
}
const core={parseDate,formatISO,compute};
root.RomisaaPlannerCore=core;
if(typeof module==='object'&&module.exports)module.exports=core;
if(typeof document==='undefined')return;
const e=id=>document.getElementById(id);
const localToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const isoAdd=(date,num)=>formatISO(parseDate(date)+num*DAY);
const nice=iso=>new Date(parseDate(iso)).toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
const today=localToday();
e('pl-start').value=today;e('pl-event').value=isoAdd(today,30);
let current=null,timer=0;
function showMessage(message){
  e('pl-toast').textContent=message;e('pl-toast').classList.add('on');
  clearTimeout(timer);timer=setTimeout(()=>e('pl-toast').classList.remove('on'),2600);
}
function render(){
  try{
    const data={start:e('pl-start').value,event:e('pl-event').value,production:e('pl-production').value,shipping:e('pl-shipping').value,buffer:e('pl-buffer').value};
    const r=compute(data);current={...r,data};
    const stat=e('pl-status');
    stat.className='pl-status '+(r.ok?'ok':'late');
    e('pl-status-title').textContent=r.ok?'المدة الافتراضية تكفي ✓':'المدة الافتراضية غير كافية';
    e('pl-status-note').textContent=r.ok?'يوجد هامش '+r.slack+' يوم بين الموعد المحسوب والمناسبة، وفق مدخلاتك فقط.':'الموعد المحسوب يتجاوز المناسبة بـ '+Math.abs(r.slack)+' يوم وفق مدخلاتك.';
    e('pl-estimated').textContent=nice(r.ready);
    e('pl-occasion').textContent=nice(r.event);
    e('pl-days').textContent=r.total+' يوم';
    e('pl-slack').textContent=r.slack>=0?r.slack+' يوم هامش':Math.abs(r.slack)+' يوم تأخير';
    e('pl-timeline').innerHTML=r.stages.map(x=>'<li><span>'+x.name+'</span><small>'+nice(formatISO(x.date))+'</small></li>').join('');
    e('pl-copy').disabled=false;
    e('pl-error').hidden=true;
  }catch(err){
    current=null;e('pl-status').className='pl-status';
    e('pl-status-title').textContent='محتاجين بيانات صحيحة';
    e('pl-status-note').textContent='اختاري تاريخ البداية وتاريخ المناسبة، وحددي مددًا صحيحة.';
    e('pl-error').hidden=false;e('pl-error').textContent=err.message;
    ['pl-estimated','pl-occasion','pl-days','pl-slack'].forEach(id=>e(id).textContent='—');
    e('pl-timeline').innerHTML='';e('pl-copy').disabled=true;
  }
}
['pl-start','pl-event','pl-production','pl-shipping','pl-buffer','pl-kind'].forEach(id=>{e(id).addEventListener('input',render);e(id).addEventListener('change',render)});
e('pl-copy').addEventListener('click',async()=>{
  if(!current)return;
  const kind=e('pl-kind').value;
  const msg=[
    'خطة مواعيد تجريبية — Romisaa Sobhi Gallery',
    'ليست حجزًا أو تأكيدًا لموعد التنفيذ أو التسليم',
    'نوع القطعة: '+kind,
    'تاريخ البداية المفترض: '+nice(current.data.start),
    'تاريخ المناسبة: '+nice(current.event),
    'أيام التنفيذ (افتراض): '+current.data.production,
    'أيام التوصيل (افتراض): '+current.data.shipping,
    'هامش الأمان: '+current.data.buffer,
    'الموعد الافتراضي الناتج: '+nice(current.ready),
    'النتيجة: '+(current.ok?'المدة الافتراضية تكفي':'المدة الافتراضية لا تكفي'),
    'الرجاء تأكيد المدة والتوفر والشحن مباشرة مع الجاليري.'
  ].join('\n');
  try{await navigator.clipboard.writeText(msg);showMessage('تم نسخ الخطة التجريبية');}
  catch(err){showMessage('تعذّر النسخ، ممكن تنسخي المواعيد يدويًا');}
});
render();
})(typeof window!=='undefined'?window:globalThis);