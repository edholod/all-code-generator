(()=>{'use strict';
// The simple tab is inserted by simple-start.js; keep it full-width on every viewport.
const nav=document.querySelector('.nav-tabs');
if(!nav)return;
const simple=nav.querySelector('[data-tab="simple"]');
if(simple){
 simple.setAttribute('aria-label','Создать код без заморочек');
 // Preserve the existing SVG icon.
 const icon=simple.querySelector('svg');
 simple.replaceChildren();
 if(icon)simple.appendChild(icon);
 simple.appendChild(document.createTextNode('Создать код без заморочек'));
}
const style=document.createElement('style');
style.id='navigation-grid-runtime';
style.textContent=`
.nav-tabs{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;width:100%!important}
.nav-tabs>.nav-tab{grid-column:auto!important;min-width:0!important;min-height:78px!important;padding:11px 8px!important;font-size:13px!important;line-height:1.3!important;overflow-wrap:break-word!important;white-space:normal!important}
.nav-tabs>.nav-tab[data-tab="simple"]{grid-column:1/-1!important;min-height:88px!important;font-size:16px!important;font-weight:800!important;padding:14px 12px!important}
.nav-tabs>.nav-tab[data-tab="simple"] .nav-icon{width:27px!important;height:27px!important;margin-bottom:6px!important}
@media(min-width:700px){.nav-tabs{grid-template-columns:repeat(4,minmax(0,1fr))!important}.nav-tabs>.nav-tab[data-tab="simple"]{grid-column:1/-1!important}}
@media(max-width:360px){.nav-tabs>.nav-tab{font-size:12px!important;padding:10px 5px!important}}
`;
document.head.appendChild(style);
})();
