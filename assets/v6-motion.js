/* ROMISAA V6 Motion Foundation — small, native, adaptive; no animation library required. */
(()=>{
'use strict';
if(!('requestAnimationFrame' in window))return;
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const subjects=[...document.querySelectorAll('[data-v6-depth]')];
const meters=[...document.querySelectorAll('[data-v6-scroll-meter]')];
if(reduce||(!subjects.length&&!meters.length))return;
let ticking=false;
function draw(){
  ticking=false;
  const vh=Math.max(window.innerHeight,1);
  subjects.forEach(el=>{
    const rect=el.parentElement?.getBoundingClientRect();
    if(!rect||rect.bottom<0||rect.top>vh)return;
    const center=(rect.top+rect.height/2)/vh;
    const offset=Math.max(-28,Math.min(28,(.5-center)*48));
    el.style.transform='scale(1.07) translate3d(0,'+offset.toFixed(1)+'px,0)';
  });
  if(meters.length){
    const range=Math.max(1,document.documentElement.scrollHeight-vh);
    const progress=Math.max(0,Math.min(100,window.scrollY/range*100));
    meters.forEach(el=>el.style.width=progress.toFixed(2)+'%');
  }
}
function requestDraw(){if(!ticking){ticking=true;requestAnimationFrame(draw)}}
window.addEventListener('scroll',requestDraw,{passive:true});
window.addEventListener('resize',requestDraw,{passive:true});
requestDraw();
})();
