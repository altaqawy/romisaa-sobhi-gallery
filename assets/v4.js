/* ROMISAA — The Living Atelier V4
   Original progressive motion, reference direction: Framer editorial experiences.
   No re-used proprietary animation source. All navigation & checkout remain native/demo.
*/
(()=>{
 'use strict';
 const d=document,$=(s,r=d)=>r.querySelector(s),$$=(s,r=d)=>[...r.querySelectorAll(s)];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const coarse=window.matchMedia('(pointer: coarse)').matches;
 const page=d.body.dataset.page||'index';
 d.body.classList.add('v4-page');
 const grain=(c)=>c;
 const motionSvg=`<svg class="v4-hero-silk" viewBox="0 0 640 685" preserveAspectRatio="none" aria-hidden="true"><path class="v4-thread-path" d="M 34 600 C 64 552 71 484 49 434 C 1 326 67 223 155 213 S 308 210 320 155 C 333 84 440 46 540 75 S 622 162 592 205 C 562 248 532 274 575 313 C 635 368 617 445 564 480"/><path class="v4-thread-path v4-thread-glow" d="M 34 600 C 64 552 71 484 49 434 C 1 326 67 223 155 213 S 308 210 320 155 C 333 84 440 46 540 75 S 622 162 592 205 C 562 248 532 274 575 313 C 635 368 617 445 564 480"/><g class="v4-butterfly" transform="translate(555 456)"><path d="M0 3 C-28 -62 -73 -65 -77 -25 C-82 0 -50 16 -9 13 C-53 16 -56 52 -28 57 C-5 62 0 30 0 3Z"/><path d="M0 3 C24 -64 66 -56 71 -23 C76 3 48 14 9 13 C49 19 52 48 27 54 C7 57 0 28 0 3Z"/><path d="M0 -18 Q5 1 0 24 M0 -16 Q-8 -36 -19 -40 M0 -16 Q10 -39 20 -40" fill="none" stroke="#8e6772" stroke-width="2"/></g></svg>`;
 function initHero(){const art=$('.v3-hero-art');if(!art)return;art.insertAdjacentHTML('beforeend',motionSvg+`<span class="v4-silk-caption">A THREAD OF MEMORIES · NO. 04</span>`);let stamp=$('.hero-stamp',art);if(stamp)stamp.classList.add('v4-float');}
 function initPortal(){const portal=$('#scroll-portal .portal-sticky');if(!portal)return;portal.insertAdjacentHTML('afterbegin',`<div class="v4-portal-halo" aria-hidden="true"></div><span class="v4-portal-callout" aria-hidden="true">THE ART OF KEEPING MEMORIES</span><div class="v4-portal-diamond" aria-hidden="true"><span>✧</span></div>`);}
 const gallery=[
  ['mirror-heart-gold.webp','مراية تحفظ الحكاية','01 / THE MIRROR EDIT','مرايات'],
  ['wedding-hoop.webp','تفاصيل معمولة بالحب','02 / THE STITCH EDIT','تطريز'],
  ['cap-blue.webp','ورد بخيط وإيد','03 / LITTLE TREASURES','إكسسوارات'],
  ['graduation-cap.webp','فرحة تفضل معاكي','04 / THE GRADUATION EDIT','تخرج'],
  ['baby-set.webp','أول ذكرى صغيرة','05 / LITTLE BEGINNINGS','مواليد'],
  ['bouquet.webp','أشياء تستاهل تتقدم','06 / THE GIFT EDIT','هدايا']
 ];
 function initGallery(){const anchor=$('.v3-featured');if(!anchor)return;
  const cards=gallery.map(([file,title,sub,category],i)=>`<a draggable="false" class="v4-rail-card" style="--v4-tilt:${[2,-3,1,3,-2,2][i]}deg" href="shop.html?category=${encodeURIComponent(category)}" aria-label="شوفي مجموعة ${title}"><img draggable="false" src="assets/${file}" alt="${title}" loading="lazy"><div class="v4-rail-caption"><span><small>${sub}</small><strong>${title}</strong></span><b aria-hidden="true">↗</b></div></a>`).join('');
  anchor.insertAdjacentHTML('beforebegin',`<section class="v4-gallery" aria-label="مجموعة مختارة من الأعمال"><div class="v4-gallery-inner"><div class="v3-shell"><div class="v4-section-head"><div><span class="section-num">04 — AN OPEN ATELIER</span><h2>قطع بتتحرك... <em>بإحساس.</em></h2><p class="v4-gallery-sub">اكتشفي خامات وتفاصيل صغيرة عبر معرض قابل للسحب. كل صورة من أعمال الجاليري.</p></div><div class="v4-rail-buttons"><button type="button" class="v4-rail-button" aria-label="السابق" data-rail-prev>←</button><button type="button" class="v4-rail-button" aria-label="التالي" data-rail-next>→</button></div></div></div><div class="v4-rail" id="v4-gallery-rail" aria-label="صور منتجات يمكن تمريرها أفقيًا" tabindex="0">${cards}</div><div class="v3-shell"><span class="v4-rail-note">DRAG TO EXPLORE / اسحبي الصور</span></div></div></section>`);
  const rail=$('#v4-gallery-rail');let dragging=false,startX=0,startScroll=0,moved=false;
  const step=()=>Math.max(260,rail.querySelector('.v4-rail-card').clientWidth+22);
  $('[data-rail-prev]').addEventListener('click',()=>rail.scrollBy({left:-step(),behavior:reduced?'auto':'smooth'}));
  $('[data-rail-next]').addEventListener('click',()=>rail.scrollBy({left:step(),behavior:reduced?'auto':'smooth'}));
  rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rail.scrollBy({left:(e.key==='ArrowRight'?1:-1)*step(),behavior:reduced?'auto':'smooth'})}});
  if(coarse)return;
  rail.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;moved=false;startX=e.clientX;startScroll=rail.scrollLeft;rail.classList.add('dragging');});
  rail.addEventListener('pointermove',e=>{if(!dragging)return;const delta=e.clientX-startX;if(Math.abs(delta)>7){moved=true;rail.scrollLeft=startScroll-delta;}});
  for(const name of ['pointerup','pointercancel','pointerleave'])rail.addEventListener(name,()=>{dragging=false;rail.classList.remove('dragging')});
  rail.addEventListener('click',e=>{if(moved){e.preventDefault();moved=false}},true);
 }
 function initStitch(){const target=$('.v3-collections');if(!target)return;
  target.insertAdjacentHTML('beforebegin',`<section class="v4-stitch-section"><div class="v3-shell v4-stitch-inner"><div class="v4-stitch-figure"><img class="v4-stitch-img" loading="lazy" src="assets/embroidery-butterfly.webp" alt="لقطة مقربة لتطريز فراشة مزينة باللؤلؤ والكريستال من أعمال روميساء"><svg class="v4-stitch-svg" viewBox="0 0 290 340" aria-hidden="true"><path d="M30 292 C38 245 76 220 113 222 C172 224 176 165 150 143 C121 118 69 135 80 181 C90 221 135 213 154 181 C194 109 186 75 215 40 C224 24 253 32 257 52 C264 87 232 92 204 78 C174 63 148 88 153 127 C161 190 228 200 260 168"/><path class="v4-stitch-needle" d="M257 52 L279 8"/></svg><div class="v4-stitch-label">THE CRAFT / HANDS & HEART</div></div><div class="v4-stitch-copy"><span class="section-num">03 — THE EMBROIDERY EDIT</span><h2>من خيط بسيط...<br><em>تفاصيل بتعيش.</em></h2><p>كل غرزة لها إيقاع، وكل حبة لؤلؤ ليها مكان. بصّي عن قرب للتفاصيل اللي بتخلي القطعة اليدوية مختلفة.</p><a class="underlink" href="shop.html?category=${encodeURIComponent('تطريز')}">استكشفي أعمال التطريز <span>↗</span></a></div></div></section>`);
 }
 function initCustomPreview(){const intro=$('.custom-intro');if(!intro)return;
  const oldImg=$('img',intro);if(oldImg)oldImg.hidden=true;
  const html=`<div class="v4-custom-preview" id="v4-custom-preview" role="img" aria-label="معاينة فنية توضيحية للتخصيص وليست صورة منتج نهائي"><span class="v4-preview-stamp">ROMISAA / PERSONALIZED</span><div class="v4-preview-item" id="v4-preview-item"><small id="v4-preview-kind">HANDMADE JUST FOR YOU</small><strong id="v4-preview-name">حكايتك تبدأ هنا</strong><small id="v4-preview-date">YOUR SPECIAL MOMENT</small></div><p class="v4-custom-caption" id="v4-preview-occasion">تصور لوني مبسط يتغير مع اختياراتك</p></div><p class="v4-preview-help">✧ دي معاينة فنية للتوضيح فقط؛ شكل القطعة الحقيقي والخامات والسعر النهائي يتحددوا بالتواصل مع روميساء.</p>`;
  const soft=$('.soft-note',intro);(soft||intro.lastElementChild).insertAdjacentHTML('beforebegin',html);
  const fields=['custom-name','custom-date','custom-color','custom-type','custom-occasion'].map(id=>$('#'+id));
  const colors={'وردي / نود':'#b77f91','أبيض / شامبان':'#bc9b75','ذهبي':'#bd9352','فضي':'#9c9aab','نبيتي':'#7c3d56','حسب الاقتراح':'#ab8399'};
  const formatDate=date=>{if(!date)return 'YOUR SPECIAL MOMENT';const [y,m,day]=date.split('-');return [day,m,y].filter(Boolean).join(' · ')};
  function paint(){let [name,date,color,type,occasion]=fields.map(x=>x?.value||'');const preview=$('#v4-custom-preview'),item=$('#v4-preview-item');
   preview.style.setProperty('--preview-accent',colors[color]||'#af8d90');
   item.dataset.shape=type.includes('تطريز')?'fabric':type.includes('هدية')?'gift':type.includes('مواليد')?'baby':type.includes('إكسسوارات')?'accessory':'mirror';
   $('#v4-preview-name').textContent=name.trim().slice(0,80)||'حكايتك تبدأ هنا';$('#v4-preview-kind').textContent=type||'HANDMADE JUST FOR YOU';$('#v4-preview-date').textContent=formatDate(date);$('#v4-preview-occasion').textContent=occasion+' · '+color;
   if(!reduced)item.animate([{opacity:.8,scale:.98},{opacity:1,scale:1}],{duration:350,easing:'ease-out'});
  }
  fields.forEach(el=>el&&el.addEventListener('input',paint));paint();
 }
 function initStory(){const target=$('.about-split');if(!target)return;target.insertAdjacentHTML('afterend',`<section class="v4-story"><div class="shell"><span class="section-num">THE STORY BEHIND THE STITCH</span><h2>رحلة القطعة... من فكرة لذكرى.</h2><div class="v4-story-track"><div class="v4-story-step"><small>01 / A LITTLE IDEA</small><h3>بداية الفكرة</h3><p>مناسبة خاصة، اسم أو عبارة ليها معنى، واختيار أقرب قطعة لخيالك.</p></div><div class="v4-story-step"><small>02 / THE HANDMADE TOUCH</small><h3>تفاصيل الإيد</h3><p>تطريز وتنسيق ولمسات دقيقة تختلف حسب فكرة كل قطعة.</p></div><div class="v4-story-step"><small>03 / A MEMORY TO KEEP</small><h3>ذكرى بتفضل</h3><p>النتيجة قطعة بتفاصيل شخصية، تفضل مرتبطة باللحظة اللي اتعملت علشانها.</p></div></div></div></section>`)}
 function initAcademy(){const cards=$('.academy-grid');if(!cards)return;cards.insertAdjacentHTML('beforebegin',`<div class="v4-stitch-demo"><div><small>STITCH BY STITCH — VISUAL STUDY</small><h2>إزاي الغرزة بتكوّن رسمة؟</h2><p>تجربة توضيحية بسيطة لحركة الخيط على القماش. المحتوى هنا تصور بصري، مش درس منشور أو كورس مدفوع.</p></div><svg class="v4-stitch-sample" viewBox="0 0 430 250" role="img" aria-label="رسم توضيحي لخط خيط يتحول لغرز وزهرة"><rect x="0" y="0" width="430" height="250" rx="5" fill="#fff9f0"/><g stroke="#e9d8d1" stroke-width=".7"><path d="M0 30H430M0 70H430M0 110H430M0 150H430M0 190H430M0 230H430M35 0V250M75 0V250M115 0V250M155 0V250M195 0V250M235 0V250M275 0V250M315 0V250M355 0V250M395 0V250"/></g><path d="M45 185L83 139L122 185L161 139L201 185C243 196 263 151 260 120 C220 93 234 56 262 75 C275 31 310 47 310 83 C354 52 371 91 340 112 C370 142 336 159 307 139 C288 175 262 154 260 120"/></svg></div>`)}
 function bindIntersection(){const targets=$$('.v4-stitch-svg,.v4-stitch-sample,.v4-story-step,.v4-stitch-copy,.v4-gallery .v4-section-head');
  targets.forEach(el=>{if(!el.matches('svg'))el.classList.add('v4-enter')});
  if(reduced||!('IntersectionObserver' in window)){targets.forEach(el=>el.classList.add('v4-in','is-visible'));return}
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v4-in','is-visible');obs.unobserve(e.target)}}),{threshold:.16,rootMargin:'0px 0px -35px 0px'});
  targets.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight-20){el.classList.add('v4-in','is-visible')}else{obs.observe(el)}});
 }
 function initPhotoSpotlight(){const imgs=$$('.product-visual');if(!coarse)imgs.forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--shine-x',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--shine-y',((e.clientY-r.top)/r.height*100)+'%')})});
  const main=$('.product-main-image');if(!main)return;
  const img=$('img',main);if(!img)return;
  main.insertAdjacentHTML('beforeend','<div class="v4-photo-tools"><button class="v4-zoom-toggle" type="button" aria-pressed="false">⌕ كبّري التفاصيل</button></div><div class="v4-product-lens" aria-hidden="true"></div>');
  const lens=$('.v4-product-lens',main),button=$('.v4-zoom-toggle',main);lens.style.backgroundImage=`url("${img.getAttribute('src')}")`;
  let active=false;function toggle(force){active=typeof force==='boolean'?force:!active;button.setAttribute('aria-pressed',String(active));button.textContent=active?'× إغلاق التكبير':'⌕ كبّري التفاصيل';lens.classList.toggle('on',active)}
  button.addEventListener('click',()=>toggle());main.addEventListener('pointermove',e=>{if(!active)return;const r=main.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));lens.style.left=x*100+'%';lens.style.top=y*100+'%';lens.style.backgroundSize='280% 280%';lens.style.backgroundPosition=`${x*100}% ${y*100}%`});
  main.addEventListener('pointerleave',()=>{lens.style.opacity='0'});main.addEventListener('pointerenter',()=>{lens.style.opacity=''});
  main.addEventListener('click',e=>{if(coarse&&!e.target.closest('button')&&active)toggle(false)});
 }
 function initCartMotion(){if(reduced)return;d.addEventListener('click',e=>{const b=e.target.closest('[data-quick-add],#product-add-cart');if(!b)return;const img=b.closest('.product-card')?.querySelector('.product-visual img')||$('.product-main-image img');const target=$('.cart-trigger');if(!img||!target)return;const r=img.getBoundingClientRect(),to=target.getBoundingClientRect();
  const clone=img.cloneNode();clone.className='v4-flying-photo';clone.style.cssText=`left:${r.left}px;top:${r.top}px;width:${Math.min(130,r.width)}px;height:${Math.min(130,r.height)}px;`;d.body.append(clone);
  const dx=(to.left+to.width/2)-(r.left+65),dy=(to.top+to.height/2)-(r.top+65);
  const anim=clone.animate([{opacity:.9,transform:'translate(0,0) scale(1)'},{opacity:.85,offset:.55,transform:`translate(${dx*.45}px,${dy*.55}px) scale(.72)`},{opacity:0,transform:`translate(${dx}px,${dy}px) scale(.15)`}],{duration:800,easing:'cubic-bezier(.22,.8,.24,1)'});
  anim.onfinish=()=>{clone.remove();target.classList.add('v4-cart-pulse');setTimeout(()=>target.classList.remove('v4-cart-pulse'),710)};
  setTimeout(()=>clone.remove(),1050);
 },true)}
 function initProgress(){if(reduced)return;const bar=d.createElement('div');bar.className='v4-motion-bar';bar.setAttribute('aria-hidden','true');d.body.append(bar);let running=false;const draw=()=>{const max=Math.max(1,d.documentElement.scrollHeight-innerHeight);bar.style.transform=`scaleX(${Math.min(1,scrollY/max)})`;running=false};addEventListener('scroll',()=>{if(!running){running=true;requestAnimationFrame(draw)}},{passive:true});addEventListener('resize',draw,{passive:true});draw()}
 function updateVersion(){const label=$('.v3-version');if(label)label.textContent='THE LIVING ATELIER / V4 · DEMO'}
 if(page==='index'){initHero();initPortal();initStitch();initGallery()}
 if(page==='custom')initCustomPreview();
 if(page==='about')initStory();
 if(page==='academy')initAcademy();
 initPhotoSpotlight();initCartMotion();initProgress();bindIntersection();updateVersion();
})();