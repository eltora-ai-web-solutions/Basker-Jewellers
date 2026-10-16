const zf=()=>document.documentElement.style.setProperty('--z',document.documentElement.clientWidth/1536);zf();addEventListener('resize',zf);
let S=window.SITE||{};const RATES=S.rates||{gold:13538,silver:175.40}; // rates now managed from admin.html
let GAL=S.gallery||window.GALLERY;
const DEFN={gold:'gold-jewellery',diamond:'diamond-jewellery',bridal:'bridal-collection',necklaces:'necklaces',earrings:'earrings',bangles:'bangles',silver:'silver-jewellery'};
const CB=[['gold','Gold Jewellery',''],['diamond','Diamond Jewellery',''],['bridal','Bridal Collection',''],['necklaces','Necklaces',''],['earrings','Earrings',''],['bangles','Bangles',''],['silver','Silver Jewellery','']];
const mkC=()=>S.catsV===2?(S.cats||[]).map(x=>[x[0],x[1],x[2]||'']):CB.concat((S.cats||[]).map(x=>[x[0],x[1],'']));let C=mkC();
const isU=p=>/^(\/|https?:|data:|blob:)/.test(p),gp=(k,f)=>isU(f)?f:'images/'+k+'/'+f,ip=p=>isU(p)?p:'images/'+p;
const cov=(c,d)=>c[2]?ip(c[2]):(DEFN[c[0]]?(d?'images/ref/cat-'+c[0]+'.jpg':'images/ui/'+DEFN[c[0]]+'.jpg'):((GAL[c[0]]||[])[0]?gp(c[0],GAL[c[0]][0]):'images/ui/logo.png'));
const $=s=>document.querySelector(s);
const A0=[['Temple Necklace Set','2,85,000','gold/gold-featured-temple-necklace-set.jpg'],['Antique Jhumka','1,24,000','earrings/earrings-01-temple-lakshmi-jhumkas-ruby-emerald.jpg'],['Traditional Haram','3,15,000','necklaces/necklaces-11-bust-lakshmi-medallion-haram.jpg'],['Diamond Ring','92,000','diamond/sparkling-diamond-ring.jpg'],['Ruby Emerald Bangle','1,48,000','bangles/bangles-02-peacock-ruby-emerald-bangles-set.jpg']];
let A=S.arrivals||A0;
function rMore(){const x=C.slice(7),h=$('#more2');if(!h)return;if(!x.length){h.innerHTML='';return}h.innerHTML='<h3>More Collections</h3><div class="mg">'+x.map(c=>`<div class="mc2" onclick="openCat('${c[0]}')"><img src="${cov(c)}" alt="${c[1]}"><b>${c[1]}</b><span>Explore Collection →</span></div>`).join('')+'</div>'}

function rCards(){$('#cards').innerHTML=C.map(c=>`<div class="card" onclick="openCat('${c[0]}')"><img src="${cov(c)}" alt="${c[1]}"><h3>${c[1]}</h3><span>Explore Collection →</span><i>→</i></div>`).join('')}
function rArr(){$('#arr').innerHTML=A.map(a=>`<div class="p"><b>New</b><img src="${ip(a[2])}" alt="${a[0]}"><div>${a[0]}</div></div>`).join('')}
function rCols2(){const h=$('#cols2');if(!h)return;const x=C.slice(0,7),n=x.length;if(!n){h.innerHTML='';return}
 const g=14,w=Math.min(200,(1437-(n-1)*g)/n),l=(1536-(n*w+(n-1)*g))/2;
 h.innerHTML=x.map((c,i)=>{const bl=n===7&&i===0?3:0,br=n===7&&i===6?3:0;return `<div class="a cdc" style="left:${l+i*(w+g)-bl}px;top:159px;width:${w+bl+br}px;height:323px;pointer-events:auto" onclick="openCat('${c[0]}')" role="button" tabindex="0" aria-label="${c[1]}"><img src="${cov(c,1)}" alt="${c[1]}"><div class="cb"><b>${c[1]}</b><span>Explore Collection →</span><i>→</i></div></div>`}).join('')}
function renderData(){rCards();rArr();rMore();rCols2();rArr2()}
window.__applyData=d=>{S=window.SITE=d;GAL=S.gallery||GAL;C=mkC();A=S.arrivals||A0;renderData();runRates();const hb=$('#herobg');if(hb&&d.banner)hb.src=d.banner};
function openCat(k){const c=C.find(x=>x[0]==k);$('#vt').textContent=c[1];$('#vg').innerHTML=(GAL[k]||[]).map(f=>`<img loading="lazy" src="${gp(k,f)}" onclick="lb(this.src)">`).join('');$('#view').classList.add('open');$('#view').scrollTop=0;document.body.style.overflow='hidden'}
function closeCat(){$('#view').classList.remove('open');document.body.style.overflow=''}

function openArr(){$('#vt').textContent='New Arrivals';$('#vg').innerHTML=A.map(a=>`<figure class="af"><img loading="lazy" src="${ip(a[2])}" alt="${a[0]}" onclick="lb(this.src)"><figcaption><b>${a[0]}</b><a href="https://wa.me/918667862422?text=${encodeURIComponent('Hi, I am interested in '+a[0])}" target="_blank">Enquire on WhatsApp →</a></figcaption></figure>`).join('');$('#view').classList.add('open');$('#view').scrollTop=0;document.body.style.overflow='hidden'}
function lb(s){$('#lb img').src=s;$('#lb').classList.add('open')}
$('#rg').textContent='₹ '+RATES.gold.toLocaleString('en-IN');$('#rs').textContent='₹ '+RATES.silver;

let rateTok=0;function runRates(){const my=++rateTok;const R=S.rates||{},fmt=()=>new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}).replace(/am|pm/,m=>m.toUpperCase()),src=t=>{const e=$('#rsrc');if(e)e.textContent=t},
man=()=>{const l=document.querySelector('#rates .lv');if(l)l.style.display='none';src('Updated: '+(R.updated||new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}))+' | Source: Baskar Jewellers')},
chg=(id,now,prev)=>{const e=$(id);if(!e||!prev)return;const d=now-prev,p=d/prev*100;e.className='chg'+(d<0?' dn':'');e.textContent=(d<0?'↓ ':'↑ ')+Math.abs(d).toLocaleString('en-IN',{maximumFractionDigits:2})+' ('+Math.abs(p).toFixed(2)+'%)'};
if(R.mode==='manual'){$('#rg').textContent='₹ '+(+R.gold||RATES.gold).toLocaleString('en-IN');$('#rs').textContent='₹ '+(+R.silver||RATES.silver);return man()}
const LC='https://www.livechennai.com/gold_silverrate.asp',okj=r=>{if(!r.ok)throw 0;return r.json()},
 parseLC=h=>{const t=h.replace(/<(script|style)[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' '),n=s=>+s.replace(/,/g,''),D='(\\d{2}/[A-Za-z]{3}/\\d{4})',
  g=[...t.matchAll(new RegExp(D+' (\\d[\\d,]*) (\\d[\\d,]*) (\\d[\\d,]*) (\\d[\\d,]*)(?![\\d.,])','g'))],s=[...t.matchAll(new RegExp(D+' (\\d[\\d,]*\\.\\d{2}) (\\d[\\d,]*\\.\\d{2})','g'))],u=t.match(/Last Update Time:\s*(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} ?[AP]M)/);
  if(!g.length||!s.length)throw 0;return{gold22:n(g[0][4]),prevGold22:g[1]?n(g[1][4]):0,silver:n(s[0][2]),prevSilver:s[1]?n(s[1][2]):0,updated:u?u[1]:''}},
 viaProxy=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.text()}).then(parseLC),
 srcs=[()=>fetch('/api/rates').then(okj),()=>fetch('/__rates').then(okj),()=>fetch('rates.php').then(okj),()=>viaProxy('https://api.allorigins.win/raw?url='+encodeURIComponent(LC)),()=>viaProxy('https://corsproxy.io/?'+encodeURIComponent(LC))];
(async()=>{let d=null;for(const f of srcs){try{const r=await f();if(r&&r.gold22>0&&r.silver>0){d=r;break}}catch(e){}}
 if(my!==rateTok)return;
 if(d){try{localStorage.setItem('bj_rate_last',JSON.stringify(d))}catch(e){}}
 else{try{d=JSON.parse(localStorage.getItem('bj_rate_last')||'null')}catch(e){}if(!d)return man()}
 $('#rg').textContent='₹ '+d.gold22.toLocaleString('en-IN');$('#rs').textContent='₹ '+d.silver.toLocaleString('en-IN',{minimumFractionDigits:2});
 src('Updated: '+(d.updated||fmt())+' | Source: LiveChennai');
 chg('#rgc',d.gold22,d.prevGold22);chg('#rsc',d.silver,d.prevSilver)})()}runRates();setInterval(runRates,600000);
$('#rb').onclick=()=>$('#rates').classList.toggle('open');$('#rx').onclick=()=>$('#rates').classList.remove('open');
$('#mb').onclick=()=>$('#nav').classList.toggle('open');$('#nav').onclick=()=>$('#nav').classList.remove('open');
const links=[...document.querySelectorAll('#nav a')];
(()=>{const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.hash=='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});document.querySelectorAll('section').forEach(s=>o.observe(s))})();

function rArr2(){const h=$('#arr2');if(!h)return;const nA=Math.min(5,A.length),wA=268,R=[...Array(nA)].map((_,i)=>[(1536-(nA*wA+(nA-1)*14))/2+i*(wA+14),wA]);if(!nA){h.innerHTML='';return}
 h.innerHTML=(A.slice(0,5)).map((a,i)=>`<div class="a ac" style="left:${R[i][0]-1}px;top:604px;width:${R[i][1]+2}px;height:232px"><div class="ai"><img src="${ip(a[2])}" alt="${a[0]}"></div><span class="nw">New</span><svg class="hr" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg><div class="ab"><div class="nm">${a[0]}</div><button class="ct" aria-label="Enquire about ${a[0]}" onclick="location.href='https://wa.me/918667862422?text='+encodeURIComponent('Hi, I am interested in ${a[0]} ')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4h2l2.2 11h10.6L20 7H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg></button></div></div>`).join('')}
const wa=(f,t)=>f.addEventListener('submit',e=>{e.preventDefault();const L=[...new FormData(f).entries()].filter(([k,v])=>v&&v!=='on'&&(!(v instanceof File)||v.name)).map(([k,v])=>k+': '+(v instanceof File?v.name+' (please send this image on WhatsApp)':v));open('https://wa.me/918667862422?text='+encodeURIComponent(t+'\n'+L.join('\n')),'_blank')});
document.querySelectorAll('.up input[type=file]').forEach(i=>i.onchange=()=>{const n=i.parentNode.querySelector('span');if(i.files[0])n.textContent=i.files[0].name});
wa($('#cform'),'Custom Jewellery Request');wa($('#eform'),'Enquiry');wa($('#cform2'),'Custom Jewellery Request');wa($('#eform2'),'Enquiry');

(()=>{const r=$('#rates'),b=$('#rb');let man=false;const top=()=>document.body.classList.toggle('top',scrollY<30);top();
 if(innerWidth>=1001)r.classList.add('open');
 addEventListener('scroll',()=>{top();if(!man&&innerWidth>=1001){if(scrollY>160)r.classList.remove('open')}});
 b.addEventListener('click',()=>{man=true});$('#rx').addEventListener('click',()=>{man=true});})();

renderData();
(async()=>{try{if(!window.claude||!claude.use)return;const db=await claude.use('db');if(!db)return;db.doc('site/data').onSnapshot(s=>{if(s.exists){try{window.__applyData(JSON.parse(s.data().json))}catch(e){}}})}catch(e){}})();
