(()=>{'use strict';
const nav=document.querySelector('.nav-tabs'), main=document.querySelector('main.app');if(!nav||!main)return;
const css=document.createElement('style');css.textContent=`
.nav-tabs{grid-template-columns:repeat(5,minmax(0,1fr))!important}.simple-start{margin-top:14px}.simple-start section{padding:20px;border:1px solid #e0e3ed;border-radius:20px;background:#fff}.simple-start h1{font-size:24px;margin:0 0 6px}.simple-start .simple-lead{color:#667085;font-size:14px;margin:0 0 18px}.simple-start textarea{min-height:115px;font-size:17px}.simple-start .simple-types{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 18px}.simple-start .simple-types button{border:1px solid #d6d9e6;background:#f7f8fc;border-radius:12px;padding:11px 15px;cursor:pointer;font:inherit;font-size:14px}.simple-start .simple-types button[aria-pressed=true]{background:#6e45dc;color:white;border-color:#6e45dc}.simple-start .simple-result{margin-top:18px;text-align:center}.simple-start .simple-result canvas{max-width:100%;height:auto}.simple-start .simple-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.simple-start .simple-actions button{flex:1;min-width:125px}.simple-start .simple-error{color:#b42318}.simple-start .simple-tip{color:#667085;font-size:13px}.simple-start .simple-result[hidden]{display:none}.simple-start .simple-edit{width:100%;margin:10px 0;border:1px solid #d6d9e6;border-radius:12px;padding:12px;background:white;font:inherit}.simple-start .simple-save-help{margin:10px 0}.simple-start .simple-save-help[hidden]{display:none}.simple-start .simple-save-help img{display:block;max-width:100%;max-height:380px;margin:12px auto;border:1px solid #ddd;background:white}.simple-start .simple-save-help a{display:inline-block;margin:8px;color:#6544bd}.simple-start .simple-advanced{margin-top:16px;text-align:center}.simple-start .simple-advanced button{background:none;border:0;color:#6544bd;text-decoration:underline;cursor:pointer;font:inherit}@media(max-width:520px){.nav-tabs{gap:4px!important}.nav-tab{font-size:10px!important;padding:9px 2px!important}.nav-tab span{font-size:17px!important}.simple-start section{padding:15px}}
`;document.head.append(css);
const button=document.createElement('button');button.type='button';button.className='nav-tab active';button.dataset.tab='simple';button.setAttribute('aria-selected','true');button.innerHTML='<span>✨</span>Создать код';nav.prepend(button);
const panel=document.createElement('div');panel.id='panel-simple';panel.className='tab-panel simple-start';panel.innerHTML=`<section><h1>Создать код</h1><p class="simple-lead">Введи текст, ссылку или цифры — и сразу получи готовый код.</p><label for="simpleInput">Что нужно закодировать?</label><textarea id="simpleInput" placeholder="Например: https://example.com или 123456789012"></textarea><div class="simple-types" role="group" aria-label="Тип кода"><button type="button" data-simple-type="auto" aria-pressed="true">✨ Универсальный QR</button><button type="button" data-simple-type="qr" aria-pressed="false">QR-код</button><button type="button" data-simple-type="code128" aria-pressed="false">Штрихкод</button></div><button class="primary" id="simpleMake" type="button">Создать код</button><p class="simple-tip" id="simpleHint">Для ссылок и обычного текста обычно подходит QR-код.</p><p class="simple-error" id="simpleError" role="alert"></p><div class="simple-result" id="simpleResult" hidden><button type="button" class="simple-edit" id="simpleBack">← Назад к вводу данных</button><h2>Готово!</h2><p class="simple-tip" id="simpleFormat"></p><div class="preview" id="simplePreview"></div><div class="simple-actions"><button type="button" id="simplePng">⬇ Скачать PNG</button><button type="button" id="simpleSvg">⬇ Скачать SVG</button></div><div id="simpleSaveHelp" class="simple-save-help" hidden><p class="simple-tip">Если скачивание не началось, удерживай изображение для сохранения или открой его отдельно.</p><img id="simpleSaveImage" alt="Готовый код для сохранения"><a id="simpleSaveLink" target="_blank" rel="noopener">Открыть изображение отдельно</a><button type="button" class="simple-edit" id="simpleShare">Поделиться изображением</button><button type="button" class="simple-edit" id="simpleSaveClose">Закрыть подсказку</button></div><p class="simple-tip">Перед печатью проверь считывание камерой или сканером.</p></div><div class="simple-advanced"><button type="button" id="simpleMore">Нужны другие форматы или настройки? Открыть полный генератор</button></div></section>`;
nav.after(panel);
let selected='auto';const $=id=>document.getElementById(id);
function choose(){const value=$('simpleInput').value.trim();if(selected!=='auto')return selected;if(/^https?:\/\//i.test(value)||/\s/.test(value)||/[^\x20-\x7E]/.test(value))return 'qr';return 'qr';} // Default QR is the safest general-purpose choice; barcode is explicit.
panel.querySelectorAll('[data-simple-type]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.simpleType;panel.querySelectorAll('[data-simple-type]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('simpleHint').textContent=selected==='code128'?'Штрихкод Code 128 подходит для текста и цифр, которые должен считывать сканер.':selected==='qr'?'QR-код подходит для ссылок, текста и контактов.':'Универсальный режим создаёт QR-код. Для линейного штрихкода выбери «Штрихкод».';}));
$('simpleInput').addEventListener('input',()=>{$('simpleResult').hidden=true;$('simpleSaveHelp').hidden=true;$('simpleError').textContent='';});
$('simpleMake').addEventListener('click',()=>{const value=$('simpleInput').value.trim();$('simpleError').textContent='';$('simpleResult').hidden=true;$('simpleSaveHelp').hidden=true;if(!value){$('simpleError').textContent='Сначала введи ссылку, текст или цифры.';$('simpleInput').focus();return}if(!window.bwipjs){$('simpleError').textContent='Библиотека генерации не загрузилась. Проверь подключение к интернету.';return}const kind=choose(),bcid=kind==='code128'?'code128':'qrcode';try{const canvas=document.createElement('canvas');bwipjs.toCanvas(canvas,{bcid,text:value,scale:3,padding:12,includetext:false,barcolor:'000000',backgroundcolor:'ffffff'});$('simplePreview').replaceChildren(canvas);$('simpleFormat').textContent=kind==='code128'?'Штрихкод Code 128':'QR-код';$('simpleResult').hidden=false;$('simpleResult').scrollIntoView({block:'nearest',behavior:'smooth'});}catch(err){$('simpleError').textContent='Не удалось создать код: '+(err.message||String(err));}});
// Generate PNG synchronously inside the click handler: asynchronous canvas.toBlob()
// can lose the user gesture in Telegram and mobile WebViews.
function showSaveHelp(dataUrl){
  const img=$('simpleSaveImage'),link=$('simpleSaveLink');
  img.src=dataUrl;link.href=dataUrl;link.setAttribute('download','kod.png');
  $('simpleSaveHelp').hidden=false;
}
const isTelegramIOS=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent)&&(/Telegram/i.test(navigator.userAgent)||!!window.Telegram?.WebApp);
if(isTelegramIOS())$('simplePng').textContent='📷 Показать PNG для сохранения';
function triggerDownload(url,name){
  const a=document.createElement('a');a.href=url;a.download=name;
  document.body.appendChild(a);
  try{a.click()}finally{a.remove()}
}
function download(blob,name){
  if(!blob||!blob.size){$('simpleError').textContent='Файл не удалось сформировать.';return}
  const url=URL.createObjectURL(blob);
  try{triggerDownload(url,name);$('simpleError').textContent='Если скачивание не началось, открой изображение ниже и сохрани вручную.';}
  catch(err){$('simpleError').textContent='Скачивание заблокировано: '+(err.message||err)}
  finally{setTimeout(()=>URL.revokeObjectURL(url),60000)}
}
$('simplePng').addEventListener('click',()=>{
  const c=$('simplePreview canvas');
  if(!c){$('simpleError').textContent='Сначала создай код.';return}
  try{
    const dataUrl=c.toDataURL('image/png');
    if(!dataUrl.startsWith('data:image/png'))throw Error('Браузер не смог сформировать PNG');
    // Always show a visible fallback, even if the WebView silently ignores download.
    showSaveHelp(dataUrl);
    if(isTelegramIOS()){
      $('simpleError').textContent='PNG готов. Ниже нажми «Открыть изображение отдельно», затем используй меню «Поделиться» → «Сохранить изображение» (если доступно), либо удерживай картинку.';
      $('simpleSaveHelp').scrollIntoView({block:'nearest',behavior:'smooth'});
    }else{
      triggerDownload(dataUrl,'kod.png');
      $('simpleError').textContent='Если файл не скачался, нажми «Открыть изображение отдельно» ниже или удерживай картинку для сохранения.';
    }
  }catch(err){$('simpleError').textContent='Ошибка сохранения PNG: '+(err.message||err)}
});
$('simpleSvg').addEventListener('click',()=>{const c=$('simplePreview canvas');if(!c)return;try{const bcid=choose()==='code128'?'code128':'qrcode',svg=bwipjs.toSVG({bcid,text:$('simpleInput').value.trim(),scale:3,padding:12,includetext:false,barcolor:'000000',backgroundcolor:'ffffff'});download(new Blob([svg],{type:'image/svg+xml'}),'kod.svg')}catch(err){$('simpleError').textContent='Ошибка SVG: '+(err.message||err)}});
$('simpleBack').addEventListener('click',()=>{$('simpleResult').hidden=true;$('simpleSaveHelp').hidden=true;$('simpleInput').focus();$('simpleInput').scrollIntoView({block:'center',behavior:'smooth'})});
$('simpleShare').addEventListener('click',async()=>{try{const c=$('simplePreview canvas');if(!c)throw Error('Нет изображения');const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('PNG не создан')),'image/png'));const file=new File([blob],'kod.png',{type:'image/png'});if(!navigator.share||!navigator.canShare?.({files:[file]}))throw Error('Системное меню недоступно в этом браузере');await navigator.share({files:[file]});}catch(err){if(err.name!=='AbortError')$('simpleError').textContent='Поделиться не удалось. Попробуй открыть изображение отдельно и сохранить через меню iPhone: '+(err.message||err)}});
$('simpleSaveClose').addEventListener('click',()=>{$('simpleSaveHelp').hidden=true});

$('simpleMore').addEventListener('click',()=>{const input=$('data');if(input){input.value=$('simpleInput').value;input.dispatchEvent(new Event('input',{bubbles:true}))}window.openCodeTab('create')});
const oldOpen=window.openCodeTab;window.openCodeTab=function(name){if(name==='simple'){document.querySelectorAll('.nav-tab').forEach(t=>{const active=t.dataset.tab==='simple';t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));const p=$('panel-'+t.dataset.tab);if(p)p.hidden=!active});$('readerStop')?.click();window.scrollTo({top:0,behavior:'smooth'});}else{$('panel-simple').hidden=true;button.classList.remove('active');button.setAttribute('aria-selected','false');oldOpen(name)}};
button.addEventListener('click',()=>window.openCodeTab('simple'));window.openCodeTab('simple');
})();
