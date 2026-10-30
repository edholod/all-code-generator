/* Complete square scaling for iOS Telegram: never clip QR internals. */
(()=>{
 const preview=document.getElementById('dqPreview');
 const sizeInput=document.getElementById('dqSize');
 if(!preview||!sizeInput)return;
 let busy=false;
 function fit(){
   if(busy)return;
   busy=true;
   try{
     let stage=preview.querySelector(':scope > .qr-fit-stage');
     if(!stage){
       const nodes=Array.from(preview.children).filter(el=>el.nodeType===1);
       if(!nodes.length)return;
       stage=document.createElement('div');stage.className='qr-fit-stage';
       const original=document.createElement('div');original.className='qr-fit-original';
       stage.append(original);preview.append(stage);
       nodes.forEach(node=>original.append(node));
     }
     const original=stage.querySelector('.qr-fit-original');
     if(!original||!original.children.length)return;
     const size=Math.max(200,Math.min(1200,Number(sizeInput.value)||400));
     const available=Math.max(100,preview.clientWidth-20);
     const display=Math.min(size,available);
     const scale=display/size;
     stage.style.setProperty('width',display+'px','important');
     stage.style.setProperty('height',display+'px','important');
     original.style.setProperty('--qr-original-size',size+'px');
     original.style.setProperty('width',size+'px','important');
     original.style.setProperty('height',size+'px','important');
     original.style.setProperty('transform',`scale(${scale})`,'important');
   }finally{busy=false;}
 }
 const observer=new MutationObserver(()=>{if(!busy)requestAnimationFrame(fit)});
 observer.observe(preview,{childList:true});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>requestAnimationFrame(fit)).observe(preview);
 window.addEventListener('resize',fit,{passive:true});
 sizeInput.addEventListener('change',()=>requestAnimationFrame(fit));
 requestAnimationFrame(fit);
})();