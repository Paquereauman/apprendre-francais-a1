/* Concepteur de fiches de grammaire : blocs (titre, texte, exemple, astuce, image) sur une grille de 12 colonnes.
   Mise en page par blocs, images par glisser-déposer / collage / import, alignement automatique (grille + aimantation). */
(function(){
const X=window.CMX,L=X.L,esc=X.esc;
const css=document.createElement("style");css.textContent=`
.gd-top{position:sticky;top:0;z-index:20;background:#f3f7ff;padding:6px 0;display:grid;gap:6px}
.gd-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:#fff;border:2px solid #c9d6f0;border-radius:12px;padding:6px 8px}
.gd-bar b{font-size:.8rem;color:var(--mut);margin-right:2px}.gd-bar i{width:1px;height:22px;background:#d5def0;margin:0 3px}.gd-bar .sp{flex:1}
.gd-bar button{background:#f3f7ff;border:2px solid #d5def0;border-radius:9px;padding:5px 9px;font:inherit;font-weight:800;font-size:.85rem;color:var(--ink);cursor:pointer;min-width:34px}.gd-bar button.on{background:var(--blue);border-color:var(--blue);color:#fff}.gd-bar button:disabled{opacity:.4}
.gd-bar button.pri{background:#ffd23f;border-color:#ffd23f;color:#3a2a00}.gd-bar button.red{background:#ffe3e5;border-color:#ffe3e5;color:#b0212c}
.gd-canvas{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:10px;align-items:start;min-height:260px;background:repeating-linear-gradient(90deg,#eef3ff00 0 calc(100%/12 - 1px),#dfe8fa calc(100%/12 - 1px) calc(100%/12));border:2px dashed #c9d6f0;border-radius:14px;padding:10px}
.gd-canvas.drop{background:#eaf2ff;border-color:var(--blue)}.gd-canvas:empty:before{content:attr(data-empty);grid-column:1/-1;text-align:center;color:var(--mut);padding:50px 10px}
.gd-b{background:#fff;border:2px solid #dbe4f5;border-radius:12px;padding:8px;min-width:0;position:relative}.gd-b.sel{border-color:var(--blue);box-shadow:0 0 0 3px #2f5fa833}.gd-b.ov{border-color:#e08a00;box-shadow:0 0 0 3px #e08a0044}
.gd-grip{cursor:grab;color:var(--mut);font-weight:900;user-select:none;padding:0 4px}.gd-lb{display:flex;align-items:center;gap:4px;font-size:.78rem;color:var(--mut);font-weight:800;margin-bottom:4px}
.gd-b textarea,.gd-b input[type=text]{width:100%;box-sizing:border-box;border:2px solid #e3eaf7;border-radius:8px;padding:6px 8px;font:inherit;background:#fcfdff;resize:none;overflow:hidden;min-height:38px}.gd-b textarea:focus,.gd-b input:focus{outline:none;border-color:var(--blue)}
.gd-two{display:grid;grid-template-columns:1fr 1fr;gap:6px}.gd-b[data-c="4"] .gd-two,.gd-b[data-c="6"] .gd-two{grid-template-columns:1fr}
.gd-b.t-title input{font-weight:900;font-size:1.05rem}.gd-b.t-tip{background:#fff9e6;border-color:#f0d27a}
.gd-img{display:flex;flex-direction:column;gap:6px}.gd-img img{max-width:100%;max-height:340px;object-fit:contain;display:block;border-radius:8px}
.gd-zone{display:grid;place-items:center;text-align:center;border:2px dashed #9db8e6;border-radius:10px;padding:22px 8px;color:var(--mut);cursor:pointer;background:#f7faff}.gd-zone:hover{background:#eaf2ff}
.gd-meta{display:flex;gap:8px;flex-wrap:wrap}.gd-meta>div{flex:1;min-width:120px}
.gd-view{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px;align-items:start}.gd-view>div{min-width:0}
.gd-view h3{margin:6px 0 0;color:var(--blue)}.gd-view .tip{background:#fff7dd;border-left:4px solid #f4c64a;border-radius:8px;padding:10px 12px}
.gd-view figure{margin:0;display:flex;flex-direction:column;gap:4px}.gd-view figure img{max-width:100%;max-height:420px;object-fit:contain;border-radius:10px}.gd-view figcaption{color:var(--mut);font-size:.85rem}
@media(max-width:640px){.gd-view>div{grid-column:1/-1!important}.gd-canvas{padding:6px;gap:8px}.gd-canvas .gd-b{grid-column:1/-1!important}.gd-two{grid-template-columns:1fr!important}}
`;document.head.appendChild(css);
const D={s:null,sel:-1,drag:-1};
const TY={title:["🔤","Titre · 标题"],text:["📝","Texte · 文字"],ex:["🔊","Exemple · 例句"],tip:["💡","Astuce · 提示"],img:["🖼️","Image · 图片"]};
const WS=[[4,"⅓"],[6,"½"],[8,"⅔"],[12,"1/1"]],AL=[["l","◀"],["c","■"],["r","▶"]];
const nb=t=>({t,c:t==="img"?6:12,al:"l",fr:"",zh:"",src:""});
const B=()=>D.s.blocks;
/* ----- images : réduction + JPEG ----- */
function img2data(f){return new Promise((ok,ko)=>{if(!/^image\//.test(f.type))return ko();const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{let w=im.width,h=im.height;const m=900;if(w>m){h=Math.round(h*m/w);w=m}const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,w,h);g.drawImage(im,0,0,w,h);URL.revokeObjectURL(u);let q=.82,d=c.toDataURL("image/jpeg",q);while(d.length>240000&&q>.4){q-=.12;d=c.toDataURL("image/jpeg",q)}ok(d)};im.onerror=ko;im.src=u})}
async function addFiles(files,at){let n=0;for(const f of files){try{const src=await img2data(f);const b=nb("img");b.src=src;B().splice(at==null?B().length:at+n,0,b);n++}catch(e){}}if(n){autoWidths();D.sel=(at==null?B().length:at+n)-1;draw()}else X.toast(L("Image non reconnue · 无法识别图片"))}
/* ----- alignement automatique : images côte à côte (2 ou 3 par ligne), le reste pleine largeur ----- */
function autoWidths(){const b=B();let i=0;while(i<b.length){if(b[i].t==="img"){let j=i;while(j<b.length&&b[j].t==="img")j++;const n=j-i;for(let k=i;k<j;k++){const left=n-(k-i);b[k].c=n===1?8:(left>=3||n%3===0&&n>=3)?4:6}i=j}else{b[i].c=12;i++}}}
/* ----- rendu éditeur ----- */
const ta=(b,i,k,ph)=>`<textarea rows="1" placeholder="${ph||""}" oninput="GD.set(${i},'${k}',this.value);GD.grow(this)">${esc(b[k])}</textarea>`;
function edBlock(b,i){let body;
  if(b.t==="title")body=`<div class="gd-two"><input type="text" maxlength="90" placeholder="Titre · 法语" value="${esc(b.fr)}" oninput="GD.set(${i},'fr',this.value)"><input type="text" maxlength="90" placeholder="标题" value="${esc(b.zh)}" oninput="GD.set(${i},'zh',this.value)"></div>`;
  else if(b.t==="img")body=b.src?`<div class="gd-img" style="align-items:${b.al==="c"?"center":b.al==="r"?"flex-end":"flex-start"}"><img src="${b.src}" alt=""><div class="gd-two" style="width:100%"><input type="text" maxlength="120" placeholder="Légende · 法语说明" value="${esc(b.fr)}" oninput="GD.set(${i},'fr',this.value)"><input type="text" maxlength="120" placeholder="中文说明" value="${esc(b.zh)}" oninput="GD.set(${i},'zh',this.value)"></div><div><button class="cm-btn alt sm" onclick="GD.pick(${i})">🔄 ${L("Remplacer · 更换")}</button></div></div>`:`<div class="gd-zone" onclick="GD.pick(${i})"><div><big>🖼️</big><br>${L("Glisse une image ici ou clique · 拖入图片或点击选择")}</div></div>`;
  else body=`<div class="gd-two">${ta(b,i,"fr","Français")}${ta(b,i,"zh","中文")}</div>`;
  return`<div class="gd-b t-${b.t}${D.sel===i?" sel":""}" data-i="${i}" data-c="${b.c}" style="grid-column:span ${b.c}" onclick="GD.select(${i},event)" ondragover="GD.over(event,${i})" ondragleave="this.classList.remove('ov')" ondrop="GD.drop(event,${i})"><div class="gd-lb"><span class="gd-grip" draggable="true" ondragstart="GD.grab(event,${i})" title="${L("Déplacer · 拖动")}">⠿</span>${TY[b.t][0]} ${L(TY[b.t][1])}</div>${body}</div>`}
function toolbar(){const i=D.sel,b=B()[i];return`<div class="gd-bar"><b>${L("Ajouter · 添加")}</b>${Object.keys(TY).map(t=>`<button onclick="GD.add('${t}')">${TY[t][0]} ${L(TY[t][1])}</button>`).join("")}<span class="sp"></span><button onclick="GD.auto()" title="${L("Ranger automatiquement · 自动排版")}">✨ ${L("Ranger · 自动排版")}</button></div>
 <div class="gd-bar"><b>${b?L("Bloc sélectionné · 选中的块"):L("Clique un bloc pour le régler · 点击块进行设置")}</b>${WS.map(([c,l])=>`<button class="${b&&b.c===c?"on":""}" ${b?"":"disabled"} onclick="GD.w(${c})" title="${L("Largeur · 宽度")}">${l}</button>`).join("")}<i></i>${AL.map(([a,l])=>`<button class="${b&&b.al===a?"on":""}" ${b?"":"disabled"} onclick="GD.al('${a}')" title="${L("Alignement · 对齐")}">${l}</button>`).join("")}<i></i><button ${b&&i>0?"":"disabled"} onclick="GD.mv(-1)">↑</button><button ${b&&i<B().length-1?"":"disabled"} onclick="GD.mv(1)">↓</button><button ${b?"":"disabled"} onclick="GD.dup()">⧉</button><button class="red" ${b?"":"disabled"} onclick="GD.rm()">🗑</button></div>`}
function draw(){const c=document.getElementById("gdc");if(!c)return;c.innerHTML=B().map(edBlock).join("");document.getElementById("gdtb").innerHTML=toolbar();c.querySelectorAll("textarea").forEach(GD.grow)}
/* ----- API publique ----- */
const GD=window.GD={
 grow(t){t.style.height="auto";t.style.height=t.scrollHeight+"px"},
 set(i,k,v){B()[i][k]=v},
 select(i,e){if(e&&e.target.closest&&e.target.closest("button"))return;if(D.sel===i)return;D.sel=i;document.querySelectorAll(".gd-b").forEach(x=>x.classList.toggle("sel",+x.dataset.i===i));document.getElementById("gdtb").innerHTML=toolbar()},
 add(t){const b=nb(t),at=D.sel>=0?D.sel+1:B().length;B().splice(at,0,b);D.sel=at;draw();if(t==="img")GD.pick(at);else{const e=document.querySelector(`.gd-b[data-i="${at}"] textarea,.gd-b[data-i="${at}"] input`);e&&e.focus()}},
 w(c){B()[D.sel].c=c;draw()},al(a){B()[D.sel].al=a;draw()},
 mv(d){const i=D.sel,j=i+d,b=B();if(j<0||j>=b.length)return;[b[i],b[j]]=[b[j],b[i]];D.sel=j;draw()},
 dup(){const i=D.sel;B().splice(i+1,0,JSON.parse(JSON.stringify(B()[i])));D.sel=i+1;draw()},
 rm(){if(!confirm(L("Supprimer ce bloc ? · 删除此块？")))return;B().splice(D.sel,1);D.sel=-1;draw()},
 auto(){autoWidths();draw();X.toast(L("✨ Disposition rangée · 已自动排版"))},
 pick(i){const f=document.createElement("input");f.type="file";f.accept="image/*";f.multiple=true;f.onchange=async()=>{const fs=[...f.files];if(!fs.length)return;if(B()[i]&&B()[i].t==="img"&&!B()[i].src){const first=fs.shift();try{B()[i].src=await img2data(first)}catch(e){}}if(B()[i]&&B()[i].t==="img"&&B()[i].src&&fs.length===0&&f.dataset.rep!=="0"){}if(fs.length)await addFiles(fs,i+1);else{autoWidths();draw()}};f.click()},
 grab(e,i){D.drag=i;e.dataTransfer.effectAllowed="move";try{e.dataTransfer.setData("text/plain","b"+i)}catch(x){}},
 over(e,i){e.preventDefault();e.currentTarget.classList.add("ov")},
 drop(e,i){e.preventDefault();e.stopPropagation();e.currentTarget.classList.remove("ov");document.getElementById("gdc").classList.remove("drop");const fs=[...(e.dataTransfer.files||[])];if(fs.length){addFiles(fs,i);return}
   const a=D.drag;D.drag=-1;if(a<0||a===i)return;const b=B(),[m]=b.splice(a,1);b.splice(a<i?i-1:i,0,m);D.sel=b.indexOf(m);draw()},
 open(s){cur=window.grammarEdit;cat=null;head();crumb([["🏠 Parcours · 路径","home"],["Ressources · 资源","resourcesPage"],["Grammaire · 语法","grammarPage"],["Concepteur · 编辑器"]]);
  const blocks=(s.blocks&&s.blocks.length)?JSON.parse(JSON.stringify(s.blocks)):legacy(s);
  D.s=Object.assign({lvl:"A1",theme:"",order:0,tfr:"",tzh:"",id:""},s,{blocks});D.sel=-1;
  const themes=[...new Set((X.GS.sheets||[]).map(x=>x.theme))];
  $.innerHTML=`<div class="hm"><div class="gd-top"><div class="gd-bar"><button onclick="grammarPage()">← ${L("Annuler · 取消")}</button><span class="sp"></span><button onclick="GD.preview()">👁 ${L("Aperçu · 预览")}</button>${s.id&&!s._base?`<button class="red" onclick="grammarDel('${s.id}')">🗑</button>`:""}<button class="pri" onclick="GD.save()">💾 ${L("Enregistrer · 保存")}</button></div><div id="gdtb" style="display:grid;gap:6px"></div></div>
   <div class="hm-card cm-form"><div class="gd-meta"><div><label>${L("Niveau · 级别")}</label><select id="gel">${["A1","A2","B1"].map(v=>`<option${s.lvl===v?" selected":""}>${v}</option>`).join("")}</select></div><div style="flex:2"><label>${L("Thème (groupe) · 主题")}</label><input type="text" id="get" list="gth" value="${esc(s.theme||"")}" placeholder="Les verbes"><datalist id="gth">${themes.map(t=>`<option value="${esc(t)}">`).join("")}</datalist></div><div style="max-width:90px"><label>${L("Ordre · 顺序")}</label><input type="text" id="geo" value="${s.order||0}" inputmode="numeric"></div></div>
    <div class="gd-meta"><div style="flex:1"><label>${L("Titre en français · 法语标题")}</label><input type="text" id="gtf" maxlength="90" value="${esc(s.tfr||"")}"></div><div style="flex:1"><label>${L("标题（中文）· Titre en chinois")}</label><input type="text" id="gtz" maxlength="90" value="${esc(s.tzh||"")}"></div></div></div>
   <div class="gd-canvas" id="gdc" data-empty="${L("Ajoute un bloc avec les boutons ci-dessus, ou glisse des images ici. · 用上方按钮添加块，或把图片拖到这里。")}" ondragover="event.preventDefault();this.classList.add('drop')" ondragleave="this.classList.remove('drop')" ondrop="event.preventDefault();this.classList.remove('drop');GD.drop(event,B_END())"></div></div>`;
  window.B_END=()=>B().length;draw();
  if(!GD._paste){GD._paste=1;document.addEventListener("paste",e=>{if(cur!==window.grammarEdit||!D.s)return;const fs=[...(e.clipboardData&&e.clipboardData.files||[])].filter(f=>/^image\//.test(f.type));if(fs.length){e.preventDefault();addFiles(fs,D.sel>=0?D.sel+1:null)}})}},
 preview(){sync();const s=D.s;const w=document.createElement("div");w.className="cm-sheetbg";w.innerHTML=`<div class="cm-sheet" style="width:min(900px,100%)"><h3>${esc(s.tfr||"—")}</h3>${view(s)}<div style="text-align:right;margin-top:10px"><button class="cm-btn" onclick="this.closest('.cm-sheetbg').remove()">${L("Fermer · 关闭")}</button></div></div>`;w.addEventListener("click",e=>{if(e.target===w)w.remove()});document.body.appendChild(w)},
 async save(){sync();const s=D.s;if(!s.tfr.trim()){X.toast(L("Ajoute un titre français · 请填写法语标题"));return}
  const bl=B().filter(b=>b.t==="img"?b.src:(b.fr||b.zh));const txt=k=>bl.filter(b=>b.t==="text"||b.t==="title"||b.t==="tip").map(b=>b[k]).filter(Boolean).join("\n\n");
  const ex=bl.filter(b=>b.t==="ex").map(b=>[b.fr,b.zh]).filter(a=>a[0]);
  const r=await X.api("gram","save","",{sheet:{id:s.id,lvl:s.lvl,theme:s.theme,order:s.order,tfr:s.tfr,tzh:s.tzh,bfr:txt("fr"),bzh:txt("zh"),ex,blocks:bl}});
  if(r.ok){X.toast(L("✅ Fiche enregistrée · 已保存"));X.GS.lvl=s.lvl;const l=await X.gramAll();X.GS.sheets=l.sheets;grammarSheet(r.j.id)}else X.toast(r.status===413?L("Fiche trop lourde (images) · 内容过大（图片）"):L("Refusé ou incomplet · 被拒绝或不完整"))},
 view};
function sync(){const g=i=>document.getElementById(i);if(!g("gel"))return;const s=D.s;s.lvl=g("gel").value;s.theme=g("get").value;s.order=parseInt(g("geo").value)||0;s.tfr=g("gtf").value;s.tzh=g("gtz").value}
function legacy(s){const b=[];if(s.bfr||s.bzh){const t=nb("text");t.fr=s.bfr||"";t.zh=s.bzh||"";b.push(t)}(s.ex||[]).forEach(e=>{const x=nb("ex");x.fr=e[0];x.zh=e[1]||"";b.push(x)});return b}
/* ----- rendu lecteur ----- */
function view(s){const fr=UI()!=="zh",zh=UI()!=="fr",sp=t=>String(t).replace(/'/g,"\\'").replace(/"/g,"&quot;");
  return`<div class="gd-view">${(s.blocks||[]).map(b=>{const ta=b.al==="c"?"center":b.al==="r"?"right":"left";let h="";
   if(b.t==="title")h=`<h3>${fr?esc(b.fr):""}${fr&&zh&&b.fr&&b.zh?" · ":""}${zh?esc(b.zh):""}</h3>`;
   else if(b.t==="text")h=`${fr&&b.fr?`<div class="cm-body">${X.fmt(b.fr)}</div>`:""}${zh&&b.zh?`<div class="cm-body" style="color:var(--mut)">${X.fmt(b.zh)}</div>`:""}`;
   else if(b.t==="tip")h=`<div class="tip">💡 ${fr?esc(b.fr):""}${fr&&zh&&b.fr&&b.zh?"<br>":""}${zh?`<span style="color:var(--mut)">${esc(b.zh)}</span>`:""}</div>`;
   else if(b.t==="ex")h=`<div class="cm-ex"><button class="cm-btn alt sm" onclick="say('${sp(b.fr)}')">🔊</button><span>${esc(b.fr)}${zh&&b.zh?`<i>${esc(b.zh)}</i>`:""}</span></div>`;
   else if(b.t==="img"&&b.src)h=`<figure style="align-items:${b.al==="c"?"center":b.al==="r"?"flex-end":"flex-start"}"><img src="${b.src}" alt="${esc(b.fr)}" draggable="false">${(fr&&b.fr)||(zh&&b.zh)?`<figcaption>${fr?esc(b.fr):""}${fr&&zh&&b.fr&&b.zh?" · ":""}${zh?esc(b.zh):""}</figcaption>`:""}</figure>`;
   return`<div style="grid-column:span ${b.c||12};text-align:${ta}">${h}</div>`}).join("")}</div>`}
})();
