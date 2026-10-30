(()=>{
'use strict';
const KEY='all-code-generator-mode-v1';
const advancedTerms=/массов|excel|csv|gs1|digital link|диагностик|печать|zpl|tspl|cpcl|профессионал|pro tools|сравнен|пакетн|последовательност|термопринтер|этикетк|калибров|бренд-набор|расширенн|проект и оформлен|помощник кодирован|проверка этикетки|контрольн|архив|pdf|автоматизац|переменн|формул/i;
const simpleTerms=/умн(ые|ый) qr|wi-fi|qr для|шаблон|истори|избранн/i;
const css=document.createElement('style');css.textContent=`
.mode-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fff;border:1px solid #e6e9f1;border-radius:17px;padding:13px 15px;margin:12px 0;box-shadow:0 6px 20px #1e294408}
.mode-switch strong{display:block;font-size:14px}.mode-switch small{display:block;color:#667085;line-height:1.4;margin-top:3px}
.mode-buttons{display:flex;flex-shrink:0;gap:5px;background:#eef0f6;border-radius:12px;padding:4px}
.mode-buttons button{border:0;border-radius:9px;padding:10px 12px;font:inherit;font-size:12px;font-weight:700;background:transparent;color:#475467;cursor:pointer}
.mode-buttons button[aria-pressed="true"]{background:#6e45dc;color:#fff}
.mode-pro-hidden{display:none!important}
.mode-advanced-mark{font-size:11px;color:#6941c6;background:#f4ebff;padding:4px 7px;border-radius:8px;margin-left:7px;vertical-align:middle}
.mode-show-pro{border:1px solid #d5c9fa;border-radius:12px;padding:12px;background:#faf8ff;color:#5934bd;cursor:pointer;width:100%;font:inherit;font-weight:700;margin:12px 0}
@media(max-width:470px){.mode-switch{flex-wrap:wrap}.mode-buttons{width:100%}.mode-buttons button{flex:1}}
body[data-user-mode="pro"] .mode-switch{border-color:#d8ccff}
`;document.head.append(css);
const host=document.querySelector('.nav-tabs');if(!host)return;
const switcher=document.createElement('div');switcher.className='mode-switch';switcher.innerHTML='<div><strong id="modeTitle">Простой режим</strong><small id="modeDesc">Только основные инструменты. Все функции бесплатны.</small></div><div class="mode-buttons" role="group" aria-label="Сложность интерфейса"><button type="button" data-mode="simple">Обычный</button><button type="button" data-mode="pro">Профессиональный</button></div>';
host.before(switcher);
const banner=document.createElement('button');banner.type='button';banner.className='mode-show-pro';banner.textContent='⚙️ Показать профессиональные инструменты';banner.addEventListener('click',()=>setMode('pro'));
const create=document.getElementById('panel-create');if(create)create.append(banner);
function classify(){
 document.querySelectorAll('.tab-panel section').forEach(section=>{
  if(section.dataset.modeClassified)return;
  const h=section.querySelector('h2,h3');if(!h)return;
  const title=h.textContent.trim();
  const isCore=section.closest('#panel-create')&&/^[123]\.\s/.test(title);
  const isPrimary=section.closest('#panel-recognize')?.id==='panel-recognize'&&section.id==='reader'||section.id==='designer'||section.closest('#panel-banner')?.id==='panel-banner';
  if(isCore||isPrimary){section.dataset.modeClassified='core';return}
  if(advancedTerms.test(title)&&!simpleTerms.test(title)){
    section.dataset.modeClassified='advanced';
    const mark=document.createElement('span');mark.className='mode-advanced-mark';mark.textContent='PRO';h.append(mark);
  }else section.dataset.modeClassified='core';
 });
}
let mode='simple';try{mode=localStorage.getItem(KEY)==='pro'?'pro':'simple'}catch{}
function apply(){classify();document.body.dataset.userMode=mode;document.querySelectorAll('[data-mode-classified="advanced"]').forEach(s=>s.classList.toggle('mode-pro-hidden',mode!=='pro'));switcher.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));document.getElementById('modeTitle').textContent=mode==='pro'?'Профессиональный режим':'Простой режим';document.getElementById('modeDesc').textContent=mode==='pro'?'Все инструменты: массовая генерация, этикетки, печать и GS1.':'Основные функции без сложных настроек. Всё бесплатно.';banner.hidden=mode==='pro';}
function setMode(value){mode=value==='pro'?'pro':'simple';try{localStorage.setItem(KEY,mode)}catch{}apply()}
switcher.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})});let pending=false;
observer.observe(document.querySelector('main.app')||document.body,{childList:true,subtree:true});
apply();
})();
