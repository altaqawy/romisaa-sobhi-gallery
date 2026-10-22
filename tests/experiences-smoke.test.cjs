/* regression test for the V4/V5 experiences bootstrap and selector arrays */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../assets/atelier-experiences.js'),'utf8');
const nav={items:[],append(x){this.items.push(x)},querySelector(){return null}};
const footer={items:[],append(x){this.items.push(x)},querySelector(){return null}};
let markup='';
const featured={insertAdjacentHTML(position,content){assert.equal(position,'beforebegin');markup=content;}};
const label={textContent:''};
const document={
 body:{matches:q=>q==='[data-page=index]',dataset:{page:'index'}},
 createElement:tag=>({tag,dataset:{},classList:{add(){}},setAttribute(){},append(){},innerHTML:'',textContent:''}),
 addEventListener(){},
 querySelector:q=>({'#primary-nav':nav,'.v3-featured':featured,'.footer-top':footer,'.v3-version':label})[q]||null,
 querySelectorAll:()=>[]
};
const stubWindow={ROMISAA_PRODUCTS:[]};
new Function('window','document','matchMedia','localStorage','location','CSS',source)(
 stubWindow,document,()=>({matches:true}),{getItem(){return null},setItem(){}},{search:''},{escape:s=>s});
assert.equal((markup.match(/class="r5-tile"/g)||[]).length,4,'home should have all four experience cards');
assert.match(markup,/href="gift-card\.html"/,'gift message studio card should be discoverable');
assert.ok(nav.items.length>=2,'experience and wishlist nav links should bootstrap');
assert.match(footer.items[0].innerHTML,/gift-card\.html/,'gift card must appear in footer');
assert.match(label.textContent,/V5\.4/,'version marker should be fresh');
assert.match(source,/const tabs=\$\$\('\.r5-subnav a'\)/,'tab list must be a querySelectorAll array');
assert.match(source,/function decorateCards\(\)\{\s*\$\$\('\.product-card'\)/,'product grid must use iterable selector');
console.log('7 home experience bootstrap checks passed');
