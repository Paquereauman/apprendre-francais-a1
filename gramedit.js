/* Concepteur de fiches de grammaire, façon Canva : une page blanche, des éléments (texte, image, exemple, astuce)
   que l'on déplace à la souris, redimensionne par les poignées, et règle avec une barre d'outils flottante
   (taille, gras, italique, alignement/justification, couleur). Aimantation sur le centre, les marges et les autres éléments. */
(function(){
const X=window.CMX,L=X.L,esc=X.esc,PW=800;
const css=document.createElement("style");css.textContent=`
.gd-top{position:sticky;top:0;z-index:30;background:#f3f7ff;padding:6px 0;display:grid;gap:6px}
.gd-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:#fff;border:2px solid #c9d6f0;border-radius:12px;padding:6px 8px}.gd-bar .sp{flex:1}
.gd-bar button{background:#f3f7ff;border:2px solid #d5def0;border-radius:9px;padding:5px 10px;font:inherit;font-weight:800;font-size:.85rem;color:var(--ink);cursor:pointer}.gd-bar button:hover{border-color:var(--blue)}.gd-bar button.pri{background:#ffd23f;border-color:#ffd23f;color:#3a2a00}.gd-bar button.red{background:#ffe3e5;border-color:#ffe3e5;color:#b0212c}
.gd-meta{display:flex;gap:8px;flex-wrap:wrap;background:#fff;border:2px solid #dbe4f5;border-radius:12px;padding:8px}.gd-meta input,.gd-meta select{border:2px solid #e3eaf7;border-radius:8px;padding:6px 8px;font:inherit;min-width:0;background:#fcfdff}
.gd-wrap{position:relative;background:#e9eef8;border-radius:14px;padding:16px 8px 40px;overflow-x:hidden}
#gdpg{position:relative;width:${PW}px;margin:0 auto;background:#fff;box-shadow:0 2px 14px #0002;min-height:700px;touch-action:pan-y}
#gdpg.drop{outline:3px dashed var(--blue)}
.gdE{position:absolute;box-sizing:border-box;cursor:move;line-height:1.35;word-break:break-word;white-space:pre-wrap;user-select:none}
.gdE:hover{outline:2px solid #9db8e6}.gdE.sel{outline:2px solid var(--blue)}.gdE.ed{cursor:text;user-select:text;outline:2px solid #ffd23f}
.gdE.tip{background:#fff7dd;border-left:5px solid #f4c64a;border-radius:8px;padding:10px 14px}.gdE.ex{background:#f3f7ff;border:1px solid #dbe4f5;border-radius:10px;padding:8px 12px}
.gdE img{display:block;width:100%;height:auto;pointer-events:none;border-radius:4px}
.gdE[data-lg="fr"]:after,.gdE[data-lg="zh"]:after{content:attr(data-lg);position:absolute;right:2px;top:-9px;font-size:9px;background:#2f5fa8;color:#fff;border-radius:4px;padding:0 4px;text-transform:uppercase;opacity:0;pointer-events:none}.gdE:hover:after,.gdE.sel:after{opacity:.9}
.gdH{position:absolute;width:12px;height:12px;background:#fff;border:2px solid var(--blue);border-radius:50%;z-index:5}
.gdH.nw{left:-7px;top:-7px;cursor:nwse-resize}.gdH.ne{right:-7px;top:-7px;cursor:nesw-resize}.gdH.sw{left:-7px;bottom:-7px;cursor:nesw-resize}.gdH.se{right:-7px;bottom:-7px;cursor:nwse-resize}
.gdH.w{left:-7px;top:calc(50% - 6px);cursor:ew-resize;border-radius:4px;width:10px;height:22px;margin-top:-5px}.gdH.e{right:-7px;top:calc(50% - 6px);cursor:ew-resize;border-radius:4px;width:10px;height:22px;margin-top:-5px}
.gdG{position:absolute;background:#e5348a;pointer-events:none;z-index:9}
#gdft{position:absolute;z-index:40;display:flex;gap:3px;align-items:center;flex-wrap:nowrap;background:#1f2a44;border-radius:10px;padding:4px 6px;box-shadow:0 4px 14px #0005;white-space:nowrap}
#gdft button{background:transparent;border:0;color:#fff;min-width:28px;height:28px;border-radius:7px;font:inherit;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0 5px}#gdft button:hover{background:#ffffff26}#gdft button.on{background:#4a7bc8}
#gdft i{width:1px;height:20px;background:#ffffff40;margin:0 3px}#gdft .fs{color:#fff;font-weight:800;min-width:26px;text-align:center;font-size:.85rem}
#gdft .sw{width:18px;height:18px;border-radius:50%;border:2px solid #fff;min-width:18px;padding:0}
.gd-hint{color:var(--mut);font-size:.8rem;text-align:center;margin-top:6px}
.gd-view{position:relative;background:#fff;overflow:hidden;border-radius:10px}.gd-view .gdE{cursor:default;outline:0!important}.gd-view.flow{display:flex;flex-direction:column;gap:12px;padding:12px}.gd-view.flow .gdE{position:static;width:auto!important;left:auto!important;top:auto!important}
`;document.head.appendChild(css);
const D={s:null,sel:-1,ed:false,k:1,n:0};
const COLS=["#1f2a44","#2f5fa8","#d9534f","#1f9d63","#e08a00","#8e44e0"];
const B=()=>D.s.blocks,uid=()=>"e"+(++D.n);
const mk=(t,o)=>Object.assign({t,x:40,y:40,w:720,fs:t==="text"?18:17,al:"l",b:0,i:0,col:"",lg:"",tx:"",src:""},o||{});
const alIcon=a=>{const w={l:[14,9,13,8],c:[14,8,12,9],r:[14,9,14,7],j:[14,14,14,14]}[a],x=a==="c"?(14-0)/2:0;const ls=[0,1,2,3].map(i=>{const ww=w[i];const xx=a==="r"?14-ww:a==="c"?(14-ww)/2:0;return`<rect x="${xx+1}" y="${2+i*3.6}" width="${ww}" height="1.8" rx=".9" fill="currentColor"/>`}).join("");return`<svg width="16" height="16" viewBox="0 0 16 16">${ls}</svg>`};
/* ---------- conversion de l'ancien format (blocs en grille) ---------- */
function upgrade(bl){if(!bl.length||bl[0].x!==undefined)return bl;let y=40;const o=[];const add=(e,h)=>{e.y=y;o.push(e);y+=h};
  bl.forEach(b=>{if(b.t==="title"){if(b.fr)add(mk("text",{tx:b.fr,fs:28,b:1,lg:b.zh?"fr":""}),50);if(b.zh)add(mk("text",{tx:b.zh,fs:24,b:1,lg:"zh"}),44)}
   else if(b.t==="img"){const w=Math.min(720,Math.round((b.c||6)*60));add(mk("img",{src:b.src,w,x:b.al==="c"?(PW-w)/2:b.al==="r"?PW-40-w:40}),Math.round(w*.65)+20)}
   else{const t=b.t==="ex"?"ex":b.t==="tip"?"tip":"text";if(b.fr)add(mk(t,{tx:b.fr,lg:b.zh?"fr":""}),Math.max(60,Math.ceil(b.fr.length/70)*26+30));if(b.zh)add(mk(t,{tx:b.zh,lg:"zh"}),Math.max(60,Math.ceil(b.zh.length/40)*26+30))}});
  return o}
function legacy(s){const b=[];let y=40;if(s.bfr){b.push(mk("text",{tx:s.bfr,y,lg:s.bzh?"fr":""}));y+=Math.max(80,Math.ceil(s.bfr.length/70)*26+30)}if(s.bzh){b.push(mk("text",{tx:s.bzh,y,lg:"zh"}));y+=Math.max(80,Math.ceil(s.bzh.length/40)*26+30)}(s.ex||[]).forEach(e=>{b.push(mk("ex",{tx:e[0]+(e[1]?"\n"+e[1]:""),y}));y+=70});return b}
/* ---------- rendu d'un élément ---------- */
const sty=b=>`left:${b.x}px;top:${b.y}px;width:${b.w}px;font-size:${b.fs}px;text-align:${b.al==="j"?"justify":b.al==="c"?"center":b.al==="r"?"right":"left"};font-weight:${b.b?800:500};font-style:${b.i?"italic":"normal"};color:${b.col||"inherit"}`;
const elHtml=(b,i,ed)=>b.t==="img"?`<div class="gdE" data-i="${i}" style="${sty(b)}">${b.src?`<img src="${b.src}" alt="" draggable="false">`:""}</div>`:`<div class="gdE ${b.t}" data-i="${i}" data-lg="${b.lg}" style="${sty(b)}">${esc(b.tx)}</div>`;
/* ---------- éditeur ---------- */
function draw(){const pg=document.getElementById("gdpg");if(!pg)return;pg.innerHTML=B().map((b,i)=>elHtml(b,i)).join("")+'<div id="gdgd"></div>';pg.querySelectorAll(".gdE").forEach(bind);fit();select(D.sel,true)}
function fit(){const pg=document.getElementById("gdpg"),w=document.querySelector(".gd-wrap");if(!pg||!w)return;D.k=Math.min(1,(w.clientWidth-16)/PW);pg.style.zoom=D.k;let m=0;pg.querySelectorAll(".gdE").forEach(e=>{m=Math.max(m,e.offsetTop+e.offsetHeight)});pg.style.height=Math.max(700,m+80)+"px"}
function bind(el){el.addEventListener("pointerdown",e=>{if(e.target.classList.contains("gdH")||el.classList.contains("ed"))return;e.preventDefault();const i=+el.dataset.i;select(i);startMove(e,i,el)});
  el.addEventListener("dblclick",()=>{const i=+el.dataset.i;if(B()[i].t!=="img")edit(i,el)})}
function pt(e){return{x:e.clientX/D.k,y:e.clientY/D.k}}
function snap(i,x,y,w,h,mode){const T=7/D.k,gx=[40,PW/2,PW-40],gy=[];B().forEach((o,j)=>{if(j===i)return;const el=document.querySelector(`.gdE[data-i="${j}"]`);if(!el)return;gx.push(o.x,o.x+o.w/2,o.x+o.w);gy.push(o.y,o.y+el.offsetHeight/2,o.y+el.offsetHeight)});
  let gl=[],bx=x,by=y,dx=T,dy=T;if(mode!=="y"){[[x,0],[x+w/2,w/2],[x+w,w]].forEach(([v,off])=>gx.forEach(g=>{if(Math.abs(v-g)<dx){dx=Math.abs(v-g);bx=g-off;gl=gl.filter(q=>q.v!==1).concat([{v:1,p:g}])}}))}
  if(mode!=="x"){[[y,0],[y+h/2,h/2],[y+h,h]].forEach(([v,off])=>gy.forEach(g=>{if(Math.abs(v-g)<dy){dy=Math.abs(v-g);by=g-off;gl=gl.filter(q=>q.v!==2).concat([{v:2,p:g}])}}))}
  return{x:bx,y:by,gl}}
function guides(gl,pg){const g=document.getElementById("gdgd");if(!g)return;g.innerHTML=(gl||[]).map(q=>q.v===1?`<div class="gdG" style="left:${q.p}px;top:0;bottom:0;width:1px;height:100%"></div>`:`<div class="gdG" style="top:${q.p}px;left:0;right:0;height:1px"></div>`).join("")}
function startMove(e,i,el){const b=B()[i],p0=pt(e),x0=b.x,y0=b.y;let moved=false;const mv=ev=>{const p=pt(ev),dx=p.x-p0.x,dy=p.y-p0.y;if(!moved&&Math.abs(dx)+Math.abs(dy)<3)return;moved=true;let x=Math.max(0,Math.min(PW-30,x0+dx)),y=Math.max(0,y0+dy);const s=snap(i,x,y,b.w,el.offsetHeight);b.x=Math.round(s.x);b.y=Math.round(s.y);el.style.left=b.x+"px";el.style.top=b.y+"px";guides(s.gl);tb()};
  const up=()=>{removeEventListener("pointermove",mv);removeEventListener("pointerup",up);guides([]);fit();tb()};addEventListener("pointermove",mv);addEventListener("pointerup",up)}
function startResize(e,i,el,h){e.preventDefault();e.stopPropagation();const b=B()[i],p0=pt(e),x0=b.x,y0=b.y,w0=b.w,r=el.offsetHeight/b.w;const mv=ev=>{const p=pt(ev),dx=p.x-p0.x,dy=p.y-p0.y;let w=w0,x=x0,y=y0;
    if(h==="e"||h==="ne"||h==="se")w=w0+dx;else w=w0-dx;w=Math.max(b.t==="img"?40:80,Math.min(PW,w));if(h==="w"||h==="nw"||h==="sw")x=x0+(w0-w);if(h==="nw"||h==="ne")y=y0+(w0-w)*r*(b.t==="img"?1:0);
    if(b.t==="img"&&(h==="ne"||h==="nw")){y=y0+(w0-w)*r}
    b.w=Math.round(w);b.x=Math.round(x);b.y=Math.round(y);el.style.width=b.w+"px";el.style.left=b.x+"px";el.style.top=b.y+"px";tb()};
  const up=()=>{removeEventListener("pointermove",mv);removeEventListener("pointerup",up);fit();tb()};addEventListener("pointermove",mv);addEventListener("pointerup",up)}
function select(i,keep){const pg=document.getElementById("gdpg");if(!pg)return;if(!keep&&i===D.sel&&!D.ed){}
  if(D.sel!==i&&D.ed)endEdit();D.sel=i;pg.querySelectorAll(".gdH").forEach(h=>h.remove());pg.querySelectorAll(".gdE").forEach(e=>e.classList.toggle("sel",+e.dataset.i===i));
  const el=pg.querySelector(`.gdE[data-i="${i}"]`);if(el&&i>=0){const b=B()[i];(b.t==="img"?["nw","ne","sw","se"]:["w","e"]).forEach(h=>{const d=document.createElement("div");d.className="gdH "+h;d.addEventListener("pointerdown",ev=>startResize(ev,i,el,h));el.appendChild(d)})}tb()}
function edit(i,el){select(i);D.ed=true;el.classList.add("ed");el.contentEditable="true";el.querySelectorAll(".gdH").forEach(h=>h.remove());el.focus();const r=document.createRange();r.selectNodeContents(el);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r);
  el.oninput=()=>{B()[i].tx=el.innerText.replace(/\n$/,"");fit();tb()};el.onpaste=ev=>{ev.preventDefault();document.execCommand("insertText",false,(ev.clipboardData||window.clipboardData).getData("text"))};
  el.onblur=()=>endEdit();el.onkeydown=ev=>{if(ev.key==="Escape")el.blur()};tb()}
function endEdit(){if(!D.ed)return;D.ed=false;const el=document.querySelector(".gdE.ed");if(el){const i=+el.dataset.i;if(B()[i])B()[i].tx=el.innerText.replace(/\n$/,"");el.classList.remove("ed");el.contentEditable="false";el.oninput=el.onblur=el.onkeydown=el.onpaste=null;if(B()[i]&&B()[i].t!=="img"&&!B()[i].tx.trim()){B().splice(i,1);D.sel=-1;draw();return}}tb()}
/* ---------- barre d'outils flottante ---------- */
function tb(){let t=document.getElementById("gdft");const w=document.querySelector(".gd-wrap"),i=D.sel,b=B()[i],el=document.querySelector(`.gdE[data-i="${i}"]`);if(!b||!el||!w){t&&t.remove();return}
  if(!t){t=document.createElement("div");t.id="gdft";t.addEventListener("pointerdown",e=>{if(e.target.closest("button"))e.preventDefault()});w.appendChild(t)}
  const isT=b.t!=="img",btn=(a,l,on,title)=>`<button class="${on?"on":""}" onclick="GD.do('${a}')" title="${title||""}">${l}</button>`;
  t.innerHTML=(isT?`${btn("fs-","A−",0,L("Plus petit · 缩小"))}<span class="fs">${b.fs}</span>${btn("fs+","A+",0,L("Plus grand · 放大"))}<i></i>${btn("b","<b>B</b>",b.b,L("Gras · 加粗"))}${btn("i","<i>I</i>",b.i,L("Italique · 斜体"))}<i></i>${["l","c","r","j"].map(a=>btn("al"+a,alIcon(a),b.al===a,{l:L("Gauche · 左对齐"),c:L("Centré · 居中"),r:L("Droite · 右对齐"),j:L("Justifié · 两端对齐")}[a])).join("")}<i></i>${COLS.map(c=>`<button class="sw" style="background:${c}" onclick="GD.do('col','${c}')"></button>`).join("")}<i></i>${btn("lg",b.lg==="fr"?"FR":b.lg==="zh"?"中":"🌐",0,L("Langue affichée · 显示语言"))}<i></i>`:`${btn("rep","🔄",0,L("Remplacer · 更换"))}${btn("full","⬌",0,L("Pleine largeur · 满宽"))}<i></i>`)+btn("ctr","⊕",0,L("Centrer sur la page · 页面居中"))+btn("dup","⧉",0,L("Dupliquer · 复制"))+btn("front","⤒",0,L("Mettre devant · 置顶"))+btn("del","🗑",0,L("Supprimer · 删除"));
  const er=el.getBoundingClientRect(),wr=w.getBoundingClientRect();let left=er.left-wr.left,top=er.top-wr.top-t.offsetHeight-8;if(top<4)top=er.bottom-wr.top+8;left=Math.max(4,Math.min(left,wr.width-t.offsetWidth-4));t.style.left=left+"px";t.style.top=top+"px"}
/* ---------- images ---------- */
function img2data(f){return new Promise((ok,ko)=>{if(!/^image\//.test(f.type))return ko();const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{let w=im.width,h=im.height;const m=900;if(w>m){h=Math.round(h*m/w);w=m}const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,w,h);g.drawImage(im,0,0,w,h);URL.revokeObjectURL(u);let q=.82,d=c.toDataURL("image/jpeg",q);while(d.length>240000&&q>.4){q-=.12;d=c.toDataURL("image/jpeg",q)}ok(d)};im.onerror=ko;im.src=u})}
async function addFiles(files,at){let n=0;for(const f of files){try{const src=await img2data(f);const b=mk("img",{src,w:360,y:bottom()+20,x:at?at.x:40});if(at)b.y=at.y;B().push(b);D.sel=B().length-1;n++}catch(e){}}if(n)draw();else X.toast(L("Image non reconnue · 无法识别图片"))}
function bottom(){let m=20;document.querySelectorAll("#gdpg .gdE").forEach(e=>{m=Math.max(m,e.offsetTop+e.offsetHeight)});return m}
function pick(rep){const f=document.createElement("input");f.type="file";f.accept="image/*";f.multiple=!rep;f.onchange=async()=>{const fs=[...f.files];if(!fs.length)return;if(rep){try{B()[D.sel].src=await img2data(fs[0]);draw()}catch(e){}}else addFiles(fs)};f.click()}
/* ---------- actions ---------- */
const GD=window.GD={
 do(a,v){const b=B()[D.sel];if(!b)return;
  if(a==="fs-")b.fs=Math.max(8,b.fs-(b.fs>24?4:2));else if(a==="fs+")b.fs=Math.min(96,b.fs+(b.fs>=24?4:2));else if(a==="b")b.b=b.b?0:1;else if(a==="i")b.i=b.i?0:1;else if(a.startsWith("al"))b.al=a[2];else if(a==="col")b.col=b.col===v?"":v;
  else if(a==="lg")b.lg=b.lg===""?"fr":b.lg==="fr"?"zh":"";else if(a==="ctr"){const el=document.querySelector(`.gdE[data-i="${D.sel}"]`);b.x=Math.round((PW-b.w)/2)}else if(a==="full"){b.x=40;b.w=720}
  else if(a==="dup"){const c=JSON.parse(JSON.stringify(b));c.x=Math.min(PW-60,b.x+24);c.y=b.y+24;B().push(c);D.sel=B().length-1}else if(a==="front"){const [m]=B().splice(D.sel,1);B().push(m);D.sel=B().length-1}
  else if(a==="del"){B().splice(D.sel,1);D.sel=-1}else if(a==="rep"){pick(true);return}
  const sel=D.sel;draw();select(sel,true)},
 add(t){if(t==="img")return pick(false);const b=mk(t==="title"?"text":t,{y:bottom()+20,tx:t==="title"?"Titre":t==="ex"?"Une phrase d'exemple":t==="tip"?"Une astuce utile":"Écris ton texte ici"});if(t==="title"){b.fs=30;b.b=1;b.col="#2f5fa8"}B().push(b);D.sel=B().length-1;draw();const el=document.querySelector(`.gdE[data-i="${D.sel}"]`);el&&edit(D.sel,el)},
 open(s){cur=window.grammarEdit;cat=null;head();crumb([["🏠 Parcours · 路径","home"],["Ressources · 资源","resourcesPage"],["Grammaire · 语法","grammarPage"],["Concepteur · 编辑器"]]);
  const blocks=(s.blocks&&s.blocks.length)?upgrade(JSON.parse(JSON.stringify(s.blocks))):legacy(s);D.s=Object.assign({lvl:"A1",theme:"",order:0,tfr:"",tzh:"",id:""},s,{blocks});D.sel=-1;D.ed=false;
  const themes=[...new Set((X.GS.sheets||[]).map(x=>x.theme))];
  $.innerHTML=`<div class="hm"><div class="gd-top"><div class="gd-bar"><button onclick="grammarPage()">← ${L("Annuler · 取消")}</button><span class="sp"></span><button onclick="GD.add('title')">🔤 ${L("Titre · 标题")}</button><button onclick="GD.add('text')">📝 ${L("Texte · 文字")}</button><button onclick="GD.add('ex')">🔊 ${L("Exemple · 例句")}</button><button onclick="GD.add('tip')">💡 ${L("Astuce · 提示")}</button><button onclick="GD.add('img')">🖼️ ${L("Image · 图片")}</button><span class="sp"></span><button onclick="GD.preview()">👁</button>${s.id&&!s._base?`<button class="red" onclick="grammarDel('${s.id}')">🗑</button>`:""}<button class="pri" onclick="GD.save()">💾 ${L("Enregistrer · 保存")}</button></div></div>
   <div class="gd-meta"><input type="text" id="gtf" maxlength="90" placeholder="${L("Titre en français · 法语标题")}" value="${esc(s.tfr||"")}" style="flex:2;min-width:160px"><input type="text" id="gtz" maxlength="90" placeholder="${L("标题（中文）· Titre en chinois")}" value="${esc(s.tzh||"")}" style="flex:2;min-width:160px"><select id="gel">${["A1","A2","B1"].map(v=>`<option${s.lvl===v?" selected":""}>${v}</option>`).join("")}</select><input type="text" id="get" list="gth" placeholder="${L("Thème · 主题")}" value="${esc(s.theme||"")}" style="flex:1;min-width:110px"><datalist id="gth">${themes.map(t=>`<option value="${esc(t)}">`).join("")}</datalist><input type="text" id="geo" value="${s.order||0}" inputmode="numeric" title="${L("Ordre · 顺序")}" style="width:54px"></div>
   <div class="gd-wrap" id="gdw"><div id="gdpg" ondragover="event.preventDefault();this.classList.add('drop')" ondragleave="this.classList.remove('drop')" ondrop="GD.drop(event)"></div></div><div class="gd-hint">${L("Clique un élément pour le régler · double-clic pour écrire · glisse pour le déplacer · glisse une image ici · 点击元素进行设置，双击编辑文字，拖动可移动，图片可直接拖入。")}</div></div>`;
  draw();document.getElementById("gdpg").addEventListener("pointerdown",e=>{if(e.target.id==="gdpg"||e.target.id==="gdgd"){endEdit();select(-1)}});
  if(!GD._g){GD._g=1;document.addEventListener("keydown",e=>{if(cur!==window.grammarEdit||D.ed||!B)return;const b=D.s&&B()[D.sel];if(!b||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
     if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();GD.do("del")}else if(e.key==="d"&&(e.ctrlKey||e.metaKey)){e.preventDefault();GD.do("dup")}else if(e.key.startsWith("Arrow")){e.preventDefault();const st=e.shiftKey?10:1;if(e.key==="ArrowLeft")b.x-=st;if(e.key==="ArrowRight")b.x+=st;if(e.key==="ArrowUp")b.y-=st;if(e.key==="ArrowDown")b.y+=st;b.x=Math.max(0,b.x);b.y=Math.max(0,b.y);const s=D.sel;draw();select(s,true)}});
   document.addEventListener("paste",e=>{if(cur!==window.grammarEdit||!D.s||D.ed)return;const fs=[...(e.clipboardData&&e.clipboardData.files||[])].filter(f=>/^image\//.test(f.type));if(fs.length){e.preventDefault();addFiles(fs)}});addEventListener("resize",()=>{if(cur===window.grammarEdit){fit();tb()}});document.addEventListener("scroll",()=>{if(cur===window.grammarEdit)tb()},true)}},
 drop(e){e.preventDefault();e.currentTarget.classList.remove("drop");const fs=[...(e.dataTransfer.files||[])];if(!fs.length)return;const r=document.getElementById("gdpg").getBoundingClientRect();addFiles(fs,{x:Math.max(0,Math.round((e.clientX-r.left)/D.k-180)),y:Math.max(0,Math.round((e.clientY-r.top)/D.k-60))})},
 preview(){sync();const s=D.s,w=document.createElement("div");w.className="cm-sheetbg";w.innerHTML=`<div class="cm-sheet" style="width:min(900px,100%)"><h3>${esc(s.tfr||"—")}</h3>${view(s)}<div style="text-align:right;margin-top:10px"><button class="cm-btn" onclick="this.closest('.cm-sheetbg').remove()">${L("Fermer · 关闭")}</button></div></div>`;w.addEventListener("click",e=>{if(e.target===w)w.remove()});document.body.appendChild(w)},
 async save(){endEdit();sync();const s=D.s;if(!s.tfr.trim()){X.toast(L("Ajoute un titre français · 请填写法语标题"));return}
  const bl=B().filter(b=>b.t==="img"?b.src:b.tx.trim()).map(b=>Object.assign({},b,{x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.w)}));
  const txt=lg=>bl.filter(b=>(b.t==="text"||b.t==="tip")&&b.lg!==(lg==="fr"?"zh":"fr")).sort((a,b)=>a.y-b.y).map(b=>b.tx).filter(Boolean).join("\n\n");
  const ex=bl.filter(b=>b.t==="ex").sort((a,b)=>a.y-b.y).map(b=>{const p=b.tx.split("\n");return[p[0],p.slice(1).join(" ")]}).filter(a=>a[0]);
  const r=await X.api("gram","save","",{sheet:{id:s.id,lvl:s.lvl,theme:s.theme,order:s.order,tfr:s.tfr,tzh:s.tzh,bfr:txt("fr"),bzh:txt("zh"),ex,blocks:bl}});
  if(r.ok){X.toast(L("✅ Fiche enregistrée · 已保存"));X.GS.lvl=s.lvl;const l=await X.gramAll();X.GS.sheets=l.sheets;grammarSheet(r.j.id)}else X.toast(r.status===413?L("Fiche trop lourde (images) · 内容过大（图片）"):L("Refusé ou incomplet · 被拒绝或不完整"))},
 view,fit(id){const v=document.getElementById(id);if(!v)return;const pg=v.firstElementChild,W=v.clientWidth||v.parentElement.clientWidth;if(W<640){v.classList.add("flow");pg.style.cssText="";const els=[...pg.children].sort((a,b)=>(+a.dataset.y-+b.dataset.y)||(+a.dataset.x-+b.dataset.x));els.forEach(e=>{e.style.fontSize=Math.max(15,Math.min(+e.dataset.fs,20))+"px";pg.appendChild(e)});pg.style.display="flex";pg.style.flexDirection="column";pg.style.gap="12px";pg.style.padding="12px";v.style.height="auto";return}
   const k=W/PW;v.classList.remove("flow");pg.style.cssText=`position:relative;width:${PW}px;zoom:${k}`;let m=0;[...pg.children].forEach(e=>{m=Math.max(m,e.offsetTop+e.offsetHeight)});pg.style.height=(m+30)+"px";v.style.height=((m+30)*k)+"px"}};
function sync(){const g=i=>document.getElementById(i);if(!g("gel"))return;const s=D.s;s.lvl=g("gel").value;s.theme=g("get").value;s.order=parseInt(g("geo").value)||0;s.tfr=g("gtf").value;s.tzh=g("gtz").value}
/* ---------- lecteur ---------- */
let VN=0;
function viewOld(s){const fr=UI()!=="zh",zh=UI()!=="fr",sp=t=>String(t).replace(/'/g,"\\'").replace(/"/g,"&quot;");
  return`<div style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px">${(s.blocks||[]).map(b=>{const ta=b.al==="c"?"center":b.al==="r"?"right":"left";let h="";
   if(b.t==="title")h=`<h3>${fr?esc(b.fr):""}${fr&&zh&&b.fr&&b.zh?" · ":""}${zh?esc(b.zh):""}</h3>`;else if(b.t==="text")h=`${fr&&b.fr?`<div class="cm-body">${X.fmt(b.fr)}</div>`:""}${zh&&b.zh?`<div class="cm-body" style="color:var(--mut)">${X.fmt(b.zh)}</div>`:""}`;
   else if(b.t==="tip")h=`<div class="tip">💡 ${fr?esc(b.fr):""} ${zh?esc(b.zh):""}</div>`;else if(b.t==="ex")h=`<div class="cm-ex"><button class="cm-btn alt sm" onclick="say('${sp(b.fr)}')">🔊</button><span>${esc(b.fr)}${zh&&b.zh?`<i>${esc(b.zh)}</i>`:""}</span></div>`;
   else if(b.t==="img"&&b.src)h=`<img src="${b.src}" alt="" style="max-width:100%;border-radius:10px" draggable="false">`;return`<div style="grid-column:span ${b.c||12};text-align:${ta}">${h}</div>`}).join("")}</div>`}
function view(s){const bl=s.blocks||[];if(bl.length&&bl[0].x===undefined)return viewOld(s);const fr=UI()!=="zh",zh=UI()!=="fr",id="gdv"+(++VN),sp=t=>String(t).replace(/'/g,"\\'").replace(/"/g,"&quot;");
  const els=bl.filter(b=>b.t==="img"?b.src:(b.lg===""||(b.lg==="fr"&&fr)||(b.lg==="zh"&&zh))).map(b=>{const st=`${sty(b)}`;
   if(b.t==="img")return`<div class="gdE" data-x="${b.x}" data-y="${b.y}" data-fs="16" style="${st}"><img src="${b.src}" alt="" draggable="false"></div>`;
   const say_=b.t==="ex"?`<span style="cursor:pointer" onclick="say('${sp(b.tx.split("\n")[0])}')">🔊 </span>`:"";
   return`<div class="gdE ${b.t}" data-x="${b.x}" data-y="${b.y}" data-fs="${b.fs}" style="${st}">${say_}${esc(b.tx)}</div>`}).join("");
  setTimeout(()=>{GD.fit(id)},40);setTimeout(()=>{GD.fit(id)},400);return`<div class="gd-view" id="${id}"><div>${els}</div></div>`}
})();
