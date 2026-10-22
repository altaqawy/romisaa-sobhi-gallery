/* Custom light-weight motion for Romisaa V3 — concept inspired by scroll-based
   component patterns (Scroll Portal, Scroll Reveal, Magnetic / Parallax).
   Does NOT embed or reproduce proprietary React Bits Pro source code.
*/
(()=>{
 'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const touch=matchMedia('(hover: none), (pointer: coarse)').matches;
 const doc=document.documentElement;
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>[...root.querySelectorAll(s)];
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 let ticking=false;
 let lastY=window.scrollY;
 const header=$('.site-header');
 const portal=$('#scroll-portal');
 const portalTitle=$('[data-portal-title]');
 const portalSub=$('[data-portal-sub]');
 const portalStep=$('[data-portal-step]');
 const floating=$$('[data-parallax]');
 const scenes=[
  ['كل غرزة لها معنى.','قرّبي أكتر... وشوفي قد إيه التفاصيل الصغيرة بتفرق.'],
  ['الفن ساكن في التفاصيل.','لؤلؤ، خيوط، وشغل يدوي معمول بعناية.'],
  ['وكل ذكرى تستاهل تفضل.','تفصيلة صغيرة ممكن تحافظ على حكاية كبيرة.']
 ];
 function update(){
  const y=window.scrollY;
  if(header)header.classList.toggle('is-scrolled',y>18);
  if(portal&&!reduce.matches){
   const rect=portal.getBoundingClientRect();
   const scrollable=Math.max(1,portal.offsetHeight-window.innerHeight);
   const p=clamp(-rect.top/scrollable,0,1);
   portal.style.setProperty('--portal-p',p.toFixed(4));
   let i=p<.33?0:p<.69?1:2;
   if(portal.dataset.scene!==String(i)){
    portal.dataset.scene=String(i);
    if(portalTitle)portalTitle.textContent=scenes[i][0];
    if(portalSub)portalSub.textContent=scenes[i][1];
    if(portalStep)portalStep.textContent='0'+(i+1);
   }
  }
  // Small photographic drift, no global transforms or forced scroll-jacking.
  if(!reduce.matches && !touch){
   floating.forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.bottom>0 && r.top<innerHeight){
     const drift=clamp((innerHeight*.5-(r.top+r.height*.5))/innerHeight,-1,1);
     const img=el.querySelector('.collection-image img');
     if(img)img.style.translate=`0 ${(-drift*Number(el.dataset.parallax||0)*115).toFixed(1)}px`;
    }
   });
  }
  lastY=y;ticking=false;
 }
 window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
 window.addEventListener('resize',()=>requestAnimationFrame(update),{passive:true});
 update();
 if(!reduce.matches){
  const targets=$$('.motion-fade,.motion-reveal');
  // Lighter page-level entrances for the inner routes; preserve functional controls.
  if(document.body.dataset.page!=='index'){
   $$('.page-hero>div,.compact-head>div,.custom-intro,.paper-form,.about-split>div,.contact-layout>div').forEach(el=>{
    el.classList.add('motion-fade');targets.push(el);
   });
  }
  if('IntersectionObserver' in window){
   doc.classList.add('motion-enabled');
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -15px 0px'});
   targets.forEach(el=>{let r=el.getBoundingClientRect(); if(r.top<window.innerHeight*.92){el.classList.add('is-visible')}else{io.observe(el)}});
  }
 }
 if(!reduce.matches&&!touch){
  $$('.magnetic').forEach(el=>{
   let frame=0;
   el.addEventListener('pointermove',ev=>{
    const r=el.getBoundingClientRect();const dx=clamp((ev.clientX-r.left-r.width/2)*.12,-13,13);const dy=clamp((ev.clientY-r.top-r.height/2)*.16,-11,11);
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>el.style.transform=`translate3d(${dx}px,${dy}px,0)`);
   });
   el.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);el.style.transform=''});
  });
  $$('[data-depth]').forEach(el=>{
   let frame=0;
   el.addEventListener('pointermove',ev=>{
    const r=el.getBoundingClientRect();const x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
     const a=el.querySelector('.hero-float-photo');if(a)a.style.translate=`${x*10}px ${y*10}px`;
     const b=el.querySelector('.hero-stamp');if(b)b.style.translate=`${-x*13}px ${-y*12}px`;
    });
   });
   el.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);el.querySelectorAll('.hero-float-photo,.hero-stamp').forEach(x=>x.style.translate='')});
  });
 }
 // Animated transitions: native browser View Transitions where available.
 if(document.startViewTransition){
   // Only same-document interactive components currently use local transitions;
   // ordinary cross-page navigation stays native for robustness under file://.
 }
})();