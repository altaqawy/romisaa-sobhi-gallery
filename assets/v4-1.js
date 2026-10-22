/* ROMISAA / ATELIER CONCIERGE V4.1
   Brand-sensitive WhatsApp contact dock. An unconfirmed number is NEVER guessed.
   When the owner approves her business number, set window.ROMISAA_WHATSAPP_NUMBER
   to 20XXXXXXXXXX before this script loads. Then the primary action opens wa.me.
*/
(()=>{
  'use strict';
  const doc=document;
  if(doc.getElementById('rs-contact-dock'))return;
  const FACEBOOK='https://www.facebook.com/share/19eVdtiYUx/';
  const INSTAGRAM='https://www.instagram.com/romisaa.khlil/';
  const raw=String(window.ROMISAA_WHATSAPP_NUMBER||'').replace(/\D/g,'');
  const phone=/^20[0-9]{10}$/.test(raw)?raw:null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mark=`<svg class="rs-wa-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M8 26.5 9.6 22a11.4 11.4 0 1 1 4.7 3.9L8 26.5Z" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/><path d="M12.2 11.2c-.7 2.2.7 4.9 3 7 2.1 2 4.5 2.9 6.5 2.1l.8-1.5-3.2-1.6-1.2 1c-1.5-.6-3.1-2.4-3.7-3.8l.8-1.1-1.7-3-1.3.9Z" fill="currentColor"/></svg>`;
  const thread=`<svg class="rs-wa-thread" viewBox="0 0 108 108" aria-hidden="true"><path d="M3 72 C13 23 38 4 62 17 C95 33 82 70 62 66 C32 60 55 31 72 44 C87 55 85 86 105 97"/><path d="M3 72 C13 23 38 4 62 17 C95 33 82 70 62 66 C32 60 55 31 72 44 C87 55 85 86 105 97"/></svg>`;
  const page=doc.body.dataset.page||'index';
  const title=page==='product' ? (doc.querySelector('.product-detail h1,.product-heading h1,.product-title')?.textContent||'قطعة من الجاليري').trim() : '';
  const message=page==='custom'?'مساء الخير يا روميساء 🌸\nحابّة أعرف تفاصيل تنفيذ قطعة مخصصة بالاسم والألوان.':page==='product'?`مساء الخير يا روميساء 🌸\nحابة أسأل عن ${title||'القطعة المعروضة'}، وهل ينفع تخصيصها؟`:page==='academy'?'مساء الخير يا روميساء 🌸\nحابة أعرف تفاصيل تعليم التطريز والكورسات المتاحة.':'مساء الخير يا روميساء 🌸\nحابّة أستفسر عن شغلكم والقطع المتاحة والتخصيص.';
  const wrap=doc.createElement('div');
  wrap.id='rs-contact-dock';
  wrap.className='rs-contact-dock';
  wrap.innerHTML=`<div class="rs-wa-panel" id="rs-wa-panel" hidden role="region" aria-label="مساعد التواصل مع الجاليري">
    <div class="rs-wa-panel-top"><span class="rs-wa-kicker">THE LITTLE ATELIER NOTE</span><button type="button" class="rs-wa-close" aria-label="إغلاق نافذة التواصل">×</button></div>
    <div class="rs-wa-panel-brand"><span class="rs-wa-mini-logo">RS<small>✧</small></span><div><strong>عايزة قطعة مخصوصة؟</strong><p>اختاري طريقة التواصل اللي تناسبك.</p></div></div>
    <p class="rs-wa-note" id="rs-wa-note">${phone?'تقدري تبعتي رسالة واتساب مباشرة وتراجعي تفاصيل الطلب مع روميساء.':'رقم واتساب الجاليري لسه مش متأكدين منه، فمش هنوصّلك لرقم غلط. تقدري تنسخي رسالة جاهزة وتتواصلي عبر الصفحات الرسمية.'}</p>
    ${phone?`<a class="rs-wa-primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/${phone}?text=${encodeURIComponent(message)}">${mark}<span>ابدئي محادثة واتساب</span><b>↗</b></a>`:`<button class="rs-wa-primary rs-wa-copy" type="button"><span class="rs-wa-copy-symbol">✧</span><span>انسخي رسالة الاستفسار</span><b>↗</b></button>`}
    <div class="rs-wa-links"><a href="custom.html">صممي طلب مخصوص <span>↗</span></a><a href="${FACEBOOK}" target="_blank" rel="noopener noreferrer">فيسبوك <span>↗</span></a><a href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">إنستجرام <span>↗</span></a></div>
    <span class="rs-wa-disclaimer">نموذج تفاعلي · الأسعار والدفع تجريبيان</span>
  </div>
  <button type="button" class="rs-wa-trigger" id="rs-wa-trigger" aria-controls="rs-wa-panel" aria-expanded="false" aria-label="افتحي خيارات التواصل مع روميساء">
    <span class="rs-wa-seal">${thread}<span class="rs-wa-whatsapp">${mark}</span><span class="rs-wa-monogram">RS</span></span>
    <span class="rs-wa-label"><strong>اسألي روميساء</strong><small>LET'S CREATE A MEMORY</small></span><span class="rs-wa-chevron" aria-hidden="true">↗</span>
  </button>`;
  doc.body.appendChild(wrap);
  const trigger=wrap.querySelector('.rs-wa-trigger'),panel=wrap.querySelector('.rs-wa-panel'),close=wrap.querySelector('.rs-wa-close');
  function setOpen(open,focus=false){panel.hidden=!open;wrap.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));trigger.setAttribute('aria-label',open?'إغلاق خيارات التواصل':'افتحي خيارات التواصل مع روميساء');if(focus)(open?close:trigger).focus();}
  trigger.addEventListener('click',()=>setOpen(panel.hidden,true));
  close.addEventListener('click',()=>setOpen(false,true));
  doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false,true)});
  doc.addEventListener('pointerdown',e=>{if(!panel.hidden&&!wrap.contains(e.target))setOpen(false)});
  async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch(e){const temp=doc.createElement('textarea');temp.value=text;temp.style.cssText='position:fixed;left:-9999px;opacity:0';doc.body.append(temp);temp.select();const ok=doc.execCommand('copy');temp.remove();return ok}}
  const copyBtn=wrap.querySelector('.rs-wa-copy');
  if(copyBtn)copyBtn.addEventListener('click',async()=>{const ok=await copyText(message);const label=copyBtn.querySelector('span:nth-child(2)');label.textContent=ok?'اتنسخت الرسالة ✓':'تعذر النسخ؛ استخدمي صفحاتنا';if(!reduced)copyBtn.animate([{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:260});});
})();
