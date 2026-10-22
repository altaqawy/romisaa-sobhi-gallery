/* ROMISAA V5.4 — live, privacy-respecting gift-card editor; no remote submission. */
(function(){
  'use strict';
  const core=window.RomisaaGiftCore;
  const byId=id=>document.getElementById(id);
  if(!core||!byId('gift-editor'))return;
  const keys=['recipient','sender','message','occasion'];
  const field=key=>byId('gift-'+key);
  const DEFAULTS={theme:'pearl',occasion:'زفاف وخطوبة',recipient:'',sender:'',message:'كل ذكرى حلوة بتبدأ بتفصيلة من القلب.'};
  let active='pearl',toastTimer=0;
  const notify=msg=>{
    const el=byId('gift-toast');el.textContent=msg;el.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);
  };
  function get(){
    return core.normalize({theme:active,occasion:field('occasion').value,
      recipient:field('recipient').value,sender:field('sender').value,
      message:field('message').value});
  }
  function render(){
    const x=get();
    byId('gift-card').dataset.theme=x.theme;
    byId('gift-card-occasion').textContent=x.occasion;
    byId('gift-card-to').textContent=x.recipient?'إلى '+x.recipient:'لكل لحظة جميلة';
    byId('gift-card-message').textContent=x.message||'اكتبي رسالتك عشان تظهر هنا…';
    byId('gift-card-from').textContent=x.sender?'من '+x.sender:'WITH LOVE';
    byId('gift-count').textContent=x.message.length+' / '+core.LIMITS.message;
    byId('gift-theme-name').textContent=core.THEMES[x.theme].label;
    const v=core.validate(x);
    byId('gift-print').disabled=!v.ok;
    byId('gift-download').disabled=!v.ok;
    byId('gift-copy').disabled=!v.ok;
    byId('gift-help').textContent=v.ok?'التصميم جاهز للنسخ أو الطباعة على جهازك.':v.reason;
    document.querySelectorAll('[data-gift-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.giftTheme===x.theme)));
  }
  function saveSVG(){
    const v=core.validate(get());
    if(!v.ok){notify(v.reason);return;}
    const blob=new Blob([core.svg(v.value)],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement('a');
    anchor.href=url;anchor.download='Romisaa_Gift_Card.svg';anchor.style.display='none';
    document.body.appendChild(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    notify('تم تجهيز الكارت كملف SVG على جهازك');
  }
  function reset(){
    active=DEFAULTS.theme;
    keys.forEach(key=>field(key).value=DEFAULTS[key]);
    render();notify('رجّعنا التصميم التجريبي للبداية');
  }
  field('occasion').innerHTML=core.OCCASIONS.map(s=>{
    const option=document.createElement('option');option.value=s;option.textContent=s;return option.outerHTML;
  }).join('');
  keys.forEach(key=>{field(key).value=DEFAULTS[key];field(key).addEventListener('input',render);field(key).addEventListener('change',render);});
  document.querySelectorAll('[data-gift-theme]').forEach(b=>{
    b.addEventListener('click',()=>{if(!core.THEMES[b.dataset.giftTheme])return;active=b.dataset.giftTheme;render()});
  });
  byId('gift-print').addEventListener('click',()=>{
    const v=core.validate(get());if(!v.ok){notify(v.reason);return;}
    window.print();
  });
  byId('gift-download').addEventListener('click',saveSVG);
  byId('gift-copy').addEventListener('click',async()=>{
    const v=core.validate(get());if(!v.ok){notify(v.reason);return;}
    try{await navigator.clipboard.writeText(core.messageText(v.value));notify('تم نسخ رسالة الإهداء');}
    catch(err){notify('النسخ التلقائي غير متاح؛ حددي الرسالة وانسخيها');}
  });
  byId('gift-reset').addEventListener('click',reset);
  render();
})();