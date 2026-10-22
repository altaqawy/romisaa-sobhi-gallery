/* ROMISAA Gift Message Studio V5.4 — pure input validators and card templates. */
(function (root, create) {
  const api=create();
  root.RomisaaGiftCore=api;
  if(typeof module==="object"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const THEMES=Object.freeze({
    pearl:{label:"Pearl Letter",color:"#6b3d4c",paper:"#fffaf5",accent:"#c8ae8d"},
    rose:{label:"Blush Garden",color:"#803e57",paper:"#f9e9ea",accent:"#b87886"},
    night:{label:"Midnight Keepsake",color:"#f2e7d6",paper:"#3b2b37",accent:"#c7a77e"}
  });
  const OCCASIONS=Object.freeze(["زفاف وخطوبة","تخرج","مولود جديد","عيد ميلاد","هدية خاصة","شكر وتقدير"]);
  const LIMITS={recipient:40,sender:40,message:240};
  const normalizeText=(v,max)=>String(v??"").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,"").trim().slice(0,max);
  function normalize(raw={}){
    const theme=Object.prototype.hasOwnProperty.call(THEMES,raw.theme)?raw.theme:"pearl";
    const occasion=OCCASIONS.includes(raw.occasion)?raw.occasion:OCCASIONS[0];
    return {
      theme,occasion,
      recipient:normalizeText(raw.recipient,LIMITS.recipient),
      sender:normalizeText(raw.sender,LIMITS.sender),
      message:normalizeText(raw.message,LIMITS.message)
    };
  }
  function validate(raw){
    const value=normalize(raw);
    if(value.message.length<6)return{ok:false,value,reason:"اكتبي رسالة إهداء من 6 حروف على الأقل."};
    return{ok:true,value,reason:""};
  }
  function messageText(raw){
    const x=normalize(raw);
    return ["إهداء من Romisaa Sobhi Gallery","المناسبة: "+x.occasion,
      x.recipient?"إلى: "+x.recipient:null,
      "الرسالة: "+x.message,
      x.sender?"من: "+x.sender:null,
      "نص إهداء للتجربة فقط، غير مرتبط بطلب شراء."
    ].filter(Boolean).join("\n");
  }
  function xml(s){return String(s??"").replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));}
  function escapeLine(raw){return xml(raw).replace(/\r?\n/g," ");}
  function wrap(raw, max=32, maxLines=10) {
    const words=String(raw??"").replace(/\s+/g," ").trim().split(" ").filter(Boolean);
    const lines=[];
    for(let word of words){
      while(word.length){
        if(lines.length===0)lines.push("");
        const i=lines.length-1,line=lines[i],sep=line?" ":"";
        const space=max-line.length-sep.length;
        if(space<=0){lines.push("");continue;}
        if(word.length<=space){lines[i]=line+sep+word;word="";}
        else if(line){lines.push("");}
        else{lines[i]=word.slice(0,max);word=word.slice(max);if(word.length)lines.push("");}
      }
    }
    return lines.filter(Boolean).slice(0,maxLines);
  }
  function svg(raw){
    const x=normalize(raw),theme=THEMES[x.theme],lines=wrap(x.message,29,8);
    const from=x.sender||"WITH LOVE";const to=x.recipient?"إلى "+x.recipient:"لكل لحظة جميلة";
    const body=lines.map((line,i)=>'<text x="350" y="'+(470+i*35)+'" text-anchor="middle" direction="rtl" font-size="23" fill="'+theme.color+'" font-family="Cairo, Tahoma, sans-serif">'+escapeLine(line)+'</text>').join("");
    return '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="970" viewBox="0 0 700 970" role="img" aria-label="كارت إهداء">'
      +'<rect width="700" height="970" fill="'+theme.paper+'"/>'
      +'<rect x="36" y="36" width="628" height="898" rx="4" fill="none" stroke="'+theme.accent+'" stroke-width="2"/>'
      +'<path d="M350 93 C321 57 283 86 308 117 C324 137 350 149 350 149 C350 149 381 132 393 110 C409 79 373 62 350 93" fill="none" stroke="'+theme.accent+'" stroke-width="3"/>'
      +'<text x="350" y="203" text-anchor="middle" font-size="32" font-family="Georgia,serif" fill="'+theme.color+'">Romisaa Sobhi</text>'
      +'<text x="350" y="239" text-anchor="middle" font-size="13" letter-spacing="6" font-family="Georgia,serif" fill="'+theme.accent+'">G A L L E R Y</text>'
      +'<line x1="248" y1="282" x2="452" y2="282" stroke="'+theme.accent+'" />'
      +'<text x="350" y="344" text-anchor="middle" direction="rtl" font-size="22" font-family="Cairo, Tahoma,sans-serif" fill="'+theme.color+'">'+escapeLine(x.occasion)+'</text>'
      +'<text x="350" y="410" text-anchor="middle" direction="rtl" font-size="30" font-family="Cairo, Tahoma,sans-serif" fill="'+theme.color+'">'+escapeLine(to)+'</text>'
      +body
      +'<text x="350" y="856" text-anchor="middle" direction="rtl" font-size="23" font-family="Cairo, Tahoma,sans-serif" fill="'+theme.color+'">'+escapeLine(from)+'</text>'
      +'<text x="350" y="907" text-anchor="middle" font-size="15" letter-spacing="3" font-family="Georgia,serif" fill="'+theme.accent+'">HANDMADE WITH FEELING</text></svg>';
  }
  return{THEMES,OCCASIONS,LIMITS,normalize,validate,messageText,svg,wrap};
});