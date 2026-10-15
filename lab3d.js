/* Labo 3D du salon (Three.js) : personnage en vrai volume, réglable en direct. Utilise les fonctions de l'appli (avSVG, slLayerImg, slHeadImg…). */
(function(){
const P={tilt:18,fov:28,head:1,torso:1,legs:1,width:1,depth:1,segs:56,hair:.05,hairS:1,hairBack:1,hairBV:1,bseg:8,round:1,flat:0,faceArc:170,slices:7,thick:.03,amb:1,sun:1.1,obj:1,hatS:1,wing:.85,wcurve:1,wbend:.06,wback:0,glow:1};
const PI=[["tilt","Caméra : hauteur · 相机高度",0,60,1],["fov","Zoom (champ de vision) · 视野",14,60,1],["head","Taille tête · 头",.6,1.6,.01],["torso","Hauteur buste · 躯干",.6,1.5,.01],["legs","Hauteur jambes · 腿",.5,1.6,.01],["width","Largeur corps · 宽",.6,1.5,.01],["depth","Épaisseur corps · 厚",.6,1.8,.01],["bseg","Polygones du corps · 身体多边形",1,24,1],["round","Arrondi du corps · 圆润度",0,1.6,.01],["segs","Polygones de la tête · 头多边形",8,96,1],["hair","Relief des mèches · 发束起伏",0,.12,.005],["hairS","Volume des cheveux · 头发体积",.4,2.2,.01],["hairBack","Longueur dans le dos · 后发长度",0,2,.01],["hairBV","Volume derrière la tête · 后脑发量",0,3,.01],["flat","Facettes 0/1 · 平面着色",0,1,1],["faceArc","Largeur du visage (°) · 脸宽",100,230,1],["slices","Couches objets/chapeau · 层数",1,14,1],["thick","Épaisseur objets · 厚度",0,.3,.01],["amb","Lumière ambiante · 环境光",0,1.5,.01],["sun","Lumière directe · 直射光",0,2.5,.01],["obj","Taille objet main · 物体",.5,2,.01],["hatS","Taille chapeau/lunettes · 帽子",.6,1.6,.01],["wing","Taille ailes · 翅膀",.5,1.8,.01],["wcurve","Courbure vers l'arrière · 向后弯曲",0,1.6,.01],["wback","Distance ailes/dos · 翅膀离背",-.1,.3,.01],["glow","Intensité aura · 光环",0,2,.01]];
try{Object.assign(P,JSON.parse(localStorage.getItem("lab3d3")||"{}"))}catch(e){}
let objList=[],auraG=null,objPiv=null,ren,scene,cam,root,char,av0,dir=2,az=0,drag=null,raf=0,ov,aura,flap=[],t0=0,live=0,sigLoaded="";
const H=()=>window.THREE;
const col=h=>/^#[0-9a-f]{6}$/i.test(h||"")?h:"#888888";
/* boîte aux angles arrondis avec beaucoup de polygones (les faces gardent leurs UV : la tenue de collection reste plaquée devant) */
const OBB=new WeakMap();
function objBox(img){let b=OBB.get(img);if(b)return b;const c=document.createElement("canvas"),W=img.naturalWidth||1080,Hh=img.naturalHeight||1080;c.width=540;c.height=540;const x=c.getContext("2d");x.drawImage(img,0,0,540,540);const d=x.getImageData(0,0,540,540).data;let x0=540,y0=540,x1=0,y1=0;for(let y=0;y<540;y++)for(let xx=0;xx<540;xx++)if(d[(y*540+xx)*4+3]>25){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(y<y0)y0=y;if(y>y1)y1=y}
  b=x1>=x0?{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1}:{x:0,y:0,w:540,h:540};OBB.set(img,b);return b}
/* ---- objets tenus en vrais polygones (la prise est à l'origine, l'objet monte selon +y) ---- */
const PROC={};
function oMat(c,m,r,e){const T=H();return new T.MeshStandardMaterial({color:c,metalness:m||0,roughness:r===undefined?.5:r,emissive:e||0x000000,flatShading:!!P.flat})}
function oMesh(g,m,x,y,z){const o=new (H().Mesh)(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=true;return o}
const oSeg=()=>Math.max(8,Math.round(P.bseg)*2);
function oCyl(rt,rb,h,m,x,y,z){return oMesh(new (H().CylinderGeometry)(rt,rb,h,oSeg()),m,x,y,z)}
function oBox(w,h,d,m,x,y,z){return oMesh(new (H().BoxGeometry)(w,h,d),m,x,y,z)}
function oSph(r,m,x,y,z,sx,sy,sz){const o=oMesh(new (H().SphereGeometry)(r,oSeg(),Math.max(6,Math.round(P.bseg))),m,x,y,z);if(sx)o.scale.set(sx,sy,sz);return o}
function oCone(r,h,m,x,y,z){return oMesh(new (H().ConeGeometry)(r,h,Math.max(6,Math.round(P.bseg))),m,x,y,z)}
function oLathe(pts,m,x,y,z){const T=H();return oMesh(new T.LatheGeometry(pts.map(p=>new T.Vector2(p[0],p[1])),Math.max(10,Math.round(P.bseg)*3)),m,x,y,z)}
PROC["Trident"]=()=>{const g=new (H().Group)(),au=oMat(0xe3a824,.85,.3),wd=oMat(0x7a4a1c,0,.7);
  g.add(oCyl(.02,.02,1.0,wd,0,.15,0));g.add(oCyl(.03,.03,.07,au,0,-.37,0));g.add(oCyl(.035,.035,.05,au,0,.52,0));g.add(oBox(.3,.035,.035,au,0,.58,0));
  [-1,0,1].forEach(s=>{const h=s?.24:.34,x=s*.145;g.add(oCyl(.014,.014,h,au,x,.58+h/2,0));g.add(oCone(.032,.1,au,x,.58+h+.05,0))});return g};
PROC["Épée"]=()=>{const T=H(),g=new T.Group(),st=oMat(0xdfe6ee,.9,.2),au=oMat(0xd4a017,.85,.3);
  g.add(oCyl(.022,.022,.2,oMat(0x5a2d12,0,.7),0,0,0));g.add(oSph(.04,au,0,-.12,0));g.add(oBox(.26,.04,.06,au,0,.12,0));g.add(oBox(.07,.8,.018,st,0,.54,0));g.add(oMesh(new T.ConeGeometry(.0495,.14,4),st,0,1.01,0));return g};
PROC["Sceptre magique"]=()=>{const T=H(),g=new T.Group(),au=oMat(0xd4a017,.85,.3);
  g.add(oCyl(.016,.016,.95,au,0,.25,0));g.add(oSph(.07,oMat(0xb455ff,.2,.1,0x6a1fcf),0,.8,0));g.add(oMesh(new T.TorusGeometry(.085,.012,8,24),au,0,.8,0));
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;g.add(oMesh(new T.OctahedronGeometry(.02),oMat(0xffffff,.3,.1,0xaa66ff),Math.cos(a)*.13,.8+Math.sin(a)*.13,0))}return g};
PROC["Torche"]=()=>{const g=new (H().Group)();g.add(oCyl(.03,.022,.55,oMat(0x6b3f1a,0,.8),0,.1,0));g.add(oCyl(.06,.035,.12,oMat(0x333333,.5,.5),0,.42,0));
  g.add(oCone(.07,.2,oMat(0xff7a1a,0,.4,0xff4a00),0,.58,0));g.add(oCone(.04,.14,oMat(0xffd24a,0,.4,0xffb000),0,.6,0));return g};
PROC["Mug"]=()=>{const T=H(),g=new T.Group(),w=oMat(0xf4f4f4,0,.3);g.add(oCyl(.07,.06,.15,w,0,.04,0));g.add(oCyl(.062,.062,.01,oMat(0x4a2a12,0,.4),0,.11,0));
  const h=oMesh(new T.TorusGeometry(.04,.012,8,16,Math.PI),w,.07,.04,0);h.rotation.z=-Math.PI/2;g.add(h);return g};
PROC["Baguette"]=()=>{const T=H(),g=new T.Group(),m=oMesh(new T.CapsuleGeometry(.05,.62,6,oSeg()),oMat(0xd9a45a,0,.8),0,.22,0);m.rotation.z=.18;g.add(m);
  for(let i=0;i<5;i++){const c=oBox(.07,.012,.012,oMat(0x9c6a2a,0,.9),-.04+i*.0,.03+i*.12,.048);c.rotation.z=.18+.7;g.add(c)}return g};
PROC["Pain au chocolat"]=()=>{const g=new (H().Group)();g.add(oSph(.1,oMat(0xc27a2a,0,.7),0,.05,0,1.3,.7,.8));g.add(oSph(.04,oMat(0x3a1c0c,0,.6),0,.1,.06,1.3,.5,.5));return g};
PROC["Pomme"]=()=>{const g=new (H().Group)();g.add(oSph(.085,oMat(0xd62828,0,.35),0,.06,0));g.add(oCyl(.006,.006,.05,oMat(0x5a3a1a,0,.8),0,.15,0));g.add(oSph(.03,oMat(0x4aa83a,0,.6),.03,.16,0,1.6,.4,1));return g};
PROC["Livres"]=()=>{const g=new (H().Group)();[[0xc0392b,.22,.05],[0x2c6fbb,.2,.045],[0x2e9d5a,.19,.05]].forEach((b,i)=>g.add(oBox(b[1],b[2],.15,oMat(b[0],0,.7),0,.03+i*.05,0)));return g};
PROC["Ballon"]=()=>{const T=H(),g=new T.Group();g.add(oSph(.17,oMat(0xe63946,0,.2),0,.78,0,1,1.18,1));g.add(oMesh(new T.ConeGeometry(.03,.05,8),oMat(0xe63946,0,.3),0,.57,0));g.add(oCyl(.004,.004,.55,oMat(0xffffff,0,.9),0,.28,0));return g};
PROC["Fromage"]=()=>{const T=H(),g=new T.Group();g.add(oMesh(new T.CylinderGeometry(.13,.13,.1,oSeg(),1,false,0,1.35),oMat(0xf2c230,0,.6),0,.05,0));
  [[.07,.06,.03],[.11,.03,-.02],[.05,.08,.07]].forEach(h=>g.add(oSph(.013,oMat(0xc99a14,0,.9),h[0],h[1],h[2])));return g};
PROC["Trophée"]=()=>{const T=H(),g=new T.Group(),mt=new T.MeshStandardMaterial({color:0xf2c230,metalness:.9,roughness:.22,emissive:0x3a2800,side:T.DoubleSide,flatShading:!!P.flat}),au=oMat(0xf2c230,.9,.22);
  /* coupe : pied, tige avec nœud, vasque évasée creuse, deux anses, socle */
  g.add(oLathe([[0,0],[.075,0],[.075,.014],[.032,.03],[.02,.09],[.04,.108],[.024,.126],[.03,.16],[.055,.19],[.1,.25],[.112,.33],[.1,.39],[.108,.4],[.092,.4],[.1,.33],[.088,.255],[.02,.2],[0,.2]],mt,0,-.09,0));
  [-1,1].forEach(s=>{const h=oMesh(new T.TorusGeometry(.055,.01,8,18,Math.PI*1.1),au,s*.12,.2,0);h.rotation.z=s>0?-Math.PI*.55:Math.PI*.55+Math.PI;g.add(h)});
  g.add(oBox(.15,.03,.15,oMat(0x4a2a12,0,.6),0,-.105,0));g.scale.setScalar(.7);return g};
PROC["Verre de vin"]=()=>{const T=H(),g=new T.Group(),gl=new T.MeshStandardMaterial({color:0xddeeff,transparent:true,opacity:.35,roughness:.05,metalness:.1,side:T.DoubleSide});
  g.add(oLathe([[0,0],[.06,.005],[.012,.02],[.01,.12],[.06,.17],[.075,.3],[.07,.34]],gl,0,-.02,0));g.add(oLathe([[0,.185],[.07,.2],[.073,.26],[0,.26]],oMat(0x8a0f2a,0,.2),0,-.02,0));return g};
PROC["Bouclier"]=()=>{const T=H(),g=new T.Group(),au=oMat(0xd4a017,.85,.3),d=oCyl(.3,.3,.04,oMat(0x2c4fa8,.3,.4),0,.2,.05);d.rotation.x=Math.PI/2;g.add(d);g.add(oMesh(new T.TorusGeometry(.3,.025,8,32),au,0,.2,.05));g.add(oSph(.07,au,0,.2,.09,1,1,.6));return g};
PROC["Drapeau chinois"]=()=>{const T=H(),g=new T.Group(),cv=document.createElement("canvas");cv.width=600;cv.height=400;const c=cv.getContext("2d");c.fillStyle="#e8281a";c.fillRect(0,0,600,400);c.fillStyle="#ffde00";
  const st=(x,y,r,a)=>{c.beginPath();for(let i=0;i<5;i++){const t=a+i*4*Math.PI/5;c.lineTo(x+Math.cos(t)*r,y+Math.sin(t)*r)}c.closePath();c.fill()};st(100,100,66,-Math.PI/2);[[200,44,-.3],[240,96,.1],[240,160,.5],[200,208,.9]].forEach(q=>st(q[0],q[1],23,q[2]-Math.PI/2));
  /* hampe épaisse + pointe dorée, grand drapeau ondulé net et bien coloré (visible des deux côtés) */
  g.add(oCyl(.022,.022,1.35,oMat(0xd8d8d8,.8,.25),0,.32,0));g.add(oSph(.04,oMat(0xf2c230,.9,.25),0,1.02,0));g.add(oCyl(.03,.03,.05,oMat(0xf2c230,.9,.25),0,-.34,0));
  const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=4;const geo=new T.PlaneGeometry(.86,.57,28,8),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)+.43;p.setZ(i,Math.sin(x*7)*.04*Math.min(1,x*2.5))}geo.computeVertexNormals();
  const fl=new T.Mesh(geo,new T.MeshStandardMaterial({map:tx,emissive:0xffffff,emissiveMap:tx,emissiveIntensity:.45,side:T.DoubleSide,roughness:.7,flatShading:false}));fl.position.set(.46,.7,0);fl.castShadow=true;g.add(fl);return g};
PROC["Petit livre rouge"]=()=>{const T=H(),g=new T.Group();g.add(oBox(.13,.17,.03,oMat(0xc0151c,0,.6),0,.08,0));g.add(oMesh(new T.OctahedronGeometry(.025),oMat(0xf5d142,.6,.3),0,.1,.02));return g};
PROC["Diamant"]=()=>{const T=H(),g=new T.Group(),d=oMesh(new T.OctahedronGeometry(.13,0),new T.MeshStandardMaterial({color:0x6fe6ff,metalness:.3,roughness:.08,emissive:0x1aa0c0,flatShading:true,transparent:true,opacity:.92}),0,.2,0);d.scale.set(1,1.3,1);g.add(d);return g};
PROC["Tour Eiffel"]=()=>{const T=H(),g=new T.Group(),ir=oMat(0x6b5b4a,.6,.5);[[.11,.07,.22,.11],[.07,.045,.22,.33],[.045,.012,.34,.61]].forEach(l=>g.add(oMesh(new T.CylinderGeometry(l[1],l[0],l[2],4),ir,0,l[3],0)));g.rotation.y=Math.PI/4;return g};
PROC["Guitare"]=()=>{const T=H(),g=new T.Group(),wd=oMat(0xb5651d,0,.5);g.add(oSph(.15,wd,0,-.05,0,1,1,.35));g.add(oSph(.11,wd,0,.14,0,1,1,.35));
  const h=oMesh(new T.CylinderGeometry(.05,.05,.02,16),oMat(0x1a1a1a,0,.8),0,-.02,.055);h.rotation.x=Math.PI/2;g.add(h);g.add(oBox(.05,.6,.03,oMat(0x4a2a12,0,.6),0,.55,0));g.add(oBox(.07,.14,.03,oMat(0x3a1c0c,0,.6),0,.9,0));return g};
PROC["Casque audio"]=()=>{const T=H(),g=new T.Group(),bk=oMat(0x222222,.3,.5);g.add(oMesh(new T.TorusGeometry(.13,.015,8,24,Math.PI),bk,0,.12,0));[-1,1].forEach(s=>{const c=oCyl(.06,.06,.04,bk,s*.13,.1,0);c.rotation.z=Math.PI/2;g.add(c)});return g};
/* ---- ailes et capes en vrais polygones (plumes, membranes, cristaux, tissu) ---- */
const WSTYLE=[[/papillon/,"butterfly",0xffb3d9,0xff6fb5],[/ange/,"angel",0xffffff,0xb9c7e6],[/noires/,"feather",0x2b2b3a,0x6b6b8a],[/chauve/,"membrane",0x4a1a5e,0xb04fd6],[/cristal/,"crystal",0x78ebff,0xe8ffff],[/dragon/,"membrane",0xa81c10,0x3a0d08],[/ph[eé]nix/,"feather",0xffd24a,0xff5a14],[/h[eé]ros/,"cape",0xd62828,0xf0c020],[/vampire/,"cape",0x16161e,0xa0102a]];
function wingStyle(av){const n=WNG[(av.wng|0)-1];if(!n)return null;const nm=(n[0]||"").toLowerCase();for(const w of WSTYLE)if(w[0].test(nm))return w;return null}
function wShape(pts,s){const T=H(),sh=new T.Shape();pts.forEach((p,i)=>{if(p.length===2)i?sh.lineTo(p[0]*s,p[1]):sh.moveTo(p[0]*s,p[1]);else sh.bezierCurveTo(p[0]*s,p[1],p[2]*s,p[3],p[4]*s,p[5])});return sh}
function wExtrude(sh,m,d){const T=H(),o=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:d||.02,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:1,curveSegments:Math.max(8,Math.round(P.bseg)*2)}),m);o.castShadow=true;return o}
/* une aile (côté s = +1 droite, -1 gauche), l'épaule est à l'origine */
function mkWing(kind,c1,c2,s){const T=H(),g=new T.Group(),m1=new T.MeshStandardMaterial({color:c1,roughness:.55,metalness:.1,side:T.DoubleSide,flatShading:!!P.flat}),m2=new T.MeshStandardMaterial({color:c2,roughness:.5,metalness:.2,side:T.DoubleSide,flatShading:!!P.flat});
  if(kind==="butterfly"){g.add(wExtrude(wShape([[0,0],[.3,.9,.95,1.05,.92,.5],[.88,.15,.4,.05,0,0]],s),m1,.02));g.add(wExtrude(wShape([[0,0],[.55,-.02,.85,-.35,.62,-.7],[.4,-.85,.1,-.45,0,0]],s),m2,.02));
    const dot=oSph(.06,new T.MeshStandardMaterial({color:0xffffff,roughness:.4}),.55*s,.55,.03,1,1,.3);g.add(dot)}
  else if(kind==="angel"){/* aile d'ange : bras relevé + 3 rangées de plumes arrondies (couvertures, secondaires, primaires) */
    const S0=[0,0],E0=[.34,.52],W0=[.78,.56],Q=(t)=>{const a=1-t;return[a*a*S0[0]+2*a*t*E0[0]+t*t*W0[0],a*a*S0[1]+2*a*t*E0[1]+t*t*W0[1]]},
      fea=(L,w,col,em)=>{const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(-w,L*.25,-w*1.05,L*.82,0,L);sh.bezierCurveTo(w*1.05,L*.82,w,L*.25,0,0);
        return wExtrude(sh,new T.MeshStandardMaterial({color:col,roughness:.55,metalness:.05,emissive:em,side:T.DoubleSide,flatShading:!!P.flat}),.016)};
    const rows=[{n:9,Lm:[.5,.92],w:.085,z:-.02,sh:0,a0:-105,a1:-18},{n:8,Lm:[.36,.62],w:.075,z:.0,sh:.35,a0:-100,a1:-30},{n:7,Lm:[.2,.34],w:.06,z:.025,sh:.7,a0:-95,a1:-45}];
    rows.forEach((rw,ri)=>{for(let i=0;i<rw.n;i++){const t=i/(rw.n-1),pt=Q(.05+t*.95),th=(rw.a0+(rw.a1-rw.a0)*t)*Math.PI/180,L=rw.Lm[0]+(rw.Lm[1]-rw.Lm[0])*Math.sin(Math.min(1,t*1.1+.1)*Math.PI*.5),
        col=new T.Color(c1).lerp(new T.Color(c2),rw.sh*.5),f=fea(L,rw.w,col,new T.Color(0xffffff).multiplyScalar(.12));f.position.set(pt[0]*s,pt[1],rw.z);const dx=Math.cos(th)*s,dy=Math.sin(th);f.rotation.z=Math.atan2(-dx,dy);g.add(f)}});
    /* bras de l'aile */
    for(let i=0;i<2;i++){const a=Q(i?.5:0),b=Q(i?1:.5),dx=(b[0]-a[0])*s,dy=b[1]-a[1],L=Math.hypot(dx,dy),c=oCyl(.03,.026,L,m2,(a[0]*s+b[0]*s)/2,(a[1]+b[1])/2,0);c.rotation.z=Math.atan2(-dx,dy)*1;g.add(c)}
    g.add(oSph(.045,m2,W0[0]*s,W0[1],0))}
  else if(kind==="feather"){/* lames pointues en éventail, 2 couches, comme les ailes des premiers niveaux de MU Online */
    const A=[92,76,60,45,30,16,2,-14],Ln=[.7,.86,.95,.9,.8,.68,.52,.36];
    for(let layer=0;layer<2;layer++)A.forEach((ad,i)=>{const L=Ln[i]*(layer?.78:1),w=.075*(layer?.8:1),ang=ad*Math.PI/180,dx=Math.cos(ang)*s,dy=Math.sin(ang);
      const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(w*.9,L*.28);sh.quadraticCurveTo(w*1.15,L*.62,w*.15,L);sh.lineTo(-w*.35,L*.62);sh.quadraticCurveTo(-w*.55,L*.3,-w*.4,L*.06);sh.closePath();
      const col=new T.Color(c1).lerp(new T.Color(c2),layer*.55+i*.04),f=wExtrude(sh,new T.MeshStandardMaterial({color:col,roughness:.35,metalness:.45,emissive:new T.Color(c2).multiplyScalar(.08),side:T.DoubleSide,flatShading:!!P.flat}),.018);
      f.rotation.z=Math.atan2(-dx,dy);f.position.z=-layer*.035-i*.004;g.add(f)});
    g.add(oMesh(new T.CylinderGeometry(.03,.022,.55,8),m2,.17*s,.28,0).rotateZ(-s*.55))}
  else if(kind==="membrane"){const tips=[[.62,1.0],[1.0,.72],[1.08,.3],[.9,-.1]],pts=[[0,0],[.45,.62]];tips.forEach((p,i)=>{pts.push(p);if(i<tips.length-1)pts.push([(p[0]+tips[i+1][0])/2-.1,(p[1]+tips[i+1][1])/2-.12])});pts.push([.35,-.45]);
    g.add(wExtrude(wShape(pts.map(p=>[p[0],p[1]]),s),m1,.014));[[.45,.62],...tips].forEach((p,i)=>{if(!i)return;const dx=p[0]-.45,dy=p[1]-.62,L=Math.hypot(dx,dy),b=oCyl(.014,.01,L,m2,(.45+dx/2)*s,.62+dy/2,.01);b.rotation.z=Math.atan2(-dx*s,dy)*1;g.add(b)});
    const arm=oCyl(.022,.016,.76,m2,.225*s,.31,.01);arm.rotation.z=-s*.63;g.add(arm)}
  else if(kind==="crystal"){const n=7;for(let i=0;i<n;i++){const t=i/(n-1),ang=(85-t*105)*Math.PI/180,L=.95*(1-.3*Math.abs(t-.25)),dx=Math.cos(ang)*s,dy=Math.sin(ang),
      cr=new T.Mesh(new T.OctahedronGeometry(1),new T.MeshStandardMaterial({color:i%2?c1:c2,transparent:true,opacity:.72,roughness:.05,metalness:.3,emissive:0x1aa0c0,emissiveIntensity:.35,flatShading:true,side:T.DoubleSide}));cr.scale.set(.08,L/2,.04);cr.position.set(dx*L/2,dy*L/2,0);cr.rotation.z=Math.atan2(-dx,dy);cr.castShadow=true;g.add(cr)}}
  return g}
function mkCape(c1,c2,tw,td,y0,len,vamp){const T=H(),g=new T.Group(),geo=new T.PlaneGeometry(tw+.16,len,14,14),p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),k=(len/2-y)/len;p.setZ(i,-td/2-.03-k*.16+Math.sin(x*11+k*3)*.025*k);p.setX(i,x*(1+k*.45))}geo.computeVertexNormals();
  const cp=new T.Mesh(geo,new T.MeshStandardMaterial({color:c1,roughness:.7,side:T.DoubleSide,flatShading:!!P.flat}));cp.position.set(0,y0-len/2,0);cp.castShadow=true;g.add(cp);
  const col=oBox(tw+.2,.05,.07,new T.MeshStandardMaterial({color:c2,roughness:.5,metalness:.3}),0,y0,-td/2-.02);g.add(col);if(vamp){[-1,1].forEach(s=>{const c=oMesh(new T.ConeGeometry(.08,.22,4),new T.MeshStandardMaterial({color:c1,roughness:.7}),s*(tw/2+.04),y0+.1,-td/2-.03);c.rotation.z=-s*.2;g.add(c)})}return g}
/* courbe l'aile en profil : elle part vers l'arrière (loin de la tête), monte, puis revient vers la tête sans la toucher */
function bendWing(g,k){g.updateMatrixWorld(true);g.traverse(o=>{if(!o.isMesh)return;o.updateMatrix();const ge=o.geometry;ge.applyMatrix4(o.matrix);o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.updateMatrix();
  const p=ge.attributes.position;for(let i=0;i<p.count;i++){const d=Math.hypot(p.getX(i),p.getY(i)*.9),t=Math.min(1,d/1.0);p.setZ(i,p.getZ(i)-k*.55*Math.sin(t*Math.PI*.8))}ge.computeVertexNormals();ge.computeBoundingSphere()})}
function buildWings(av,tw,td,legH,torH,flapList){const T=H(),st=wingStyle(av);if(!st)return null;const root=new T.Group(),y0=legH+torH*.9;
  if(st[1]==="cape"){const c=mkCape(st[2],st[3],tw,td,y0,torH*1.5+legH*.6,/vampire/.test(st[0].source));c.scale.setScalar(1);root.add(c);return root}
  [1,-1].forEach(s=>{const w=mkWing(st[1],st[2],st[3],s);if(P.wcurve>0)bendWing(w,P.wcurve);w.scale.setScalar(P.wing);w.position.set(s*tw*.18,y0-.05,-td/2-.02+P.wback);w.rotation.y=s*-.2;w.rotation.z=s*-.08;root.add(w);flapList.push({wing:w,s})});return root}
/* ---- auras en 3D : vraies particules (étoiles, cœurs, flammes…) qui bougent autour du personnage ---- */
function starGeo(R,r,d){const T=H(),sh=new T.Shape();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;i?sh.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):sh.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}sh.closePath();return new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:d*.35,bevelThickness:d*.35,bevelSegments:1}).translate(0,0,-d/2)}
function heartGeo(sc,d){const T=H(),sh=new T.Shape();sh.moveTo(0,-.6);sh.bezierCurveTo(-1.1,.1,-.7,.9,0,.45);sh.bezierCurveTo(.7,.9,1.1,.1,0,-.6);return new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:d*.4,bevelThickness:d*.4,bevelSegments:2,curveSegments:10}).scale(sc,sc,sc).translate(0,0,-d*sc/2)}
function emi(c,i,o){const T=H();return new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i||1,roughness:.25,metalness:.2,transparent:o!==undefined,opacity:o===undefined?1:o,flatShading:true})}
function mkAura(av,hy){const T=H(),g=new T.Group(),nm=((AUR[(av.aur|0)-1]||[""])[0]||"").toLowerCase(),ps=[],G=P.glow;let tick=()=>{};
  const add=(m,f)=>{g.add(m);ps.push([m,f]);return m};
  const col=auraColor(av),y0=.05,H1=1.9,mk=(geo,m)=>{const o=new T.Mesh(geo,m);return o};
  if(/étincelle|etincelle/.test(nm)){for(let i=0;i<16;i++){const big=i%3===0,m=mk(starGeo(big?.11:.075,big?.05:.034,big?.04:.03),emi(i%2?0xfff0a0:0xffd23f,1.2)),ph=Math.random()*7,rad=.5+Math.random()*.35,sp=.5+Math.random()*.7,h0=.2+Math.random()*1.5;
      add(m,t=>{const a=ph+t/1000*sp,tw=1+.25*Math.sin(t/200+ph*3);m.position.set(Math.cos(a)*rad,h0+Math.sin(t/700*sp+ph)*.12,Math.sin(a)*rad);m.rotation.set(t/600+ph,t/450+ph,t/700);m.scale.setScalar(tw*(.9+.3*Math.sin(t/160+ph)))})}}
  else if(/cœur|coeur/.test(nm)){for(let i=0;i<10;i++){const m=mk(heartGeo(.11,.07),emi(0xff4d8d,.7)),ph=i/10,sw=Math.random()*6;add(m,t=>{const k=((t/4200+ph)%1);m.position.set(Math.sin(k*8+sw)*.38,.05+k*1.95,Math.cos(k*8+sw)*.38);m.rotation.y=t/500+sw;m.rotation.z=Math.sin(t/400+sw)*.3;m.scale.setScalar(Math.min(1,k*5)*(1-Math.max(0,k-.8)*5)*(.8+.4*Math.sin(t/180+sw)))})}}
  else if(/neige/.test(nm)){for(let i=0;i<28;i++){const m=mk(new T.IcosahedronGeometry(.035+Math.random()*.03,0),emi(0xffffff,.6)),ph=Math.random(),sw=Math.random()*6,rad=.3+Math.random()*.55;add(m,t=>{const k=1-((t/5200+ph)%1);m.position.set(Math.cos(k*5+sw)*rad,.02+k*2,Math.sin(k*5+sw)*rad);m.rotation.set(t/400+sw,t/500,0)})}}
  else if(/flamme/.test(nm)){for(let i=0;i<14;i++){const m=mk(new T.ConeGeometry(.07,.28,6),emi(i%2?0xff7a1a:0xffc21a,1.1,.88)),ph=Math.random(),a=Math.random()*6.28,rad=.28+Math.random()*.32;add(m,t=>{const k=((t/1700+ph)%1);m.position.set(Math.cos(a+k)*rad*(1-k*.4),.05+k*1.5,Math.sin(a+k)*rad*(1-k*.4));m.scale.set(1-k*.6,(1.1-k*.5)*(.8+.4*Math.sin(t/70+ph*9)),1-k*.6);m.material.opacity=.9*(1-k)})}}
  else if(/éclair|eclair/.test(nm)){for(let i=0;i<3;i++){const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(.09,-.3);sh.lineTo(.02,-.3);sh.lineTo(.12,-.7);sh.lineTo(-.06,-.34);sh.lineTo(.0,-.34);sh.closePath();const m=mk(new T.ExtrudeGeometry(sh,{depth:.015,bevelEnabled:false}).scale(.55,.55,.55),emi(0xfff35a,.9,.6)),a=i/3*6.28;add(m,t=>{const on=Math.sin(t/140+i*7)>.72;m.visible=on;const aa=a+t/2500;m.position.set(Math.cos(aa)*.6,1.5+Math.sin(t/300+i)*.15,Math.sin(aa)*.6);m.rotation.y=-aa;m.rotation.z=Math.sin(t/80+i)*.3})}}
  else if(/anneaux/.test(nm)){for(let i=0;i<3;i++){const gr=new T.Group(),rg=new T.Mesh(new T.TorusGeometry(.5+i*.05,.005,6,64),emi([0x6fe6ff,0xffd23f,0xff6fb5][i],.7,.45)),bl=new T.Mesh(new T.SphereGeometry(.028,8,6),emi(0xffffff,1.2,.8));bl.position.set(.5+i*.05,0,0);gr.add(rg);gr.add(bl);gr.position.y=.9;add(gr,t=>{gr.rotation.set(Math.PI/2+i*.55,t/1000*(i%2?-1:1)*.8,i*.9+t/1700)})}}
  else if(/galaxie/.test(nm)){const gr=new T.Group();for(let i=0;i<30;i++){const a=i*.8,rad=.2+i*.016,m=mk(new T.OctahedronGeometry(.011+Math.random()*.01,0),emi([0xb0a0ff,0x6fe6ff,0xffffff,0xff9be0][i%4],.7,.5));m.position.set(Math.cos(a)*rad,(Math.random()-.5)*.1,Math.sin(a)*rad);gr.add(m)}gr.position.y=.9;gr.scale.setScalar(1.2);add(gr,t=>{gr.rotation.y=t/2200;gr.rotation.x=.35+Math.sin(t/1800)*.1})}
  else if(/arc-en-ciel|arc en ciel/.test(nm)){["#ff3b30","#ff9500","#ffd60a","#34c759","#32ade6","#5856d6","#af52de"].forEach((c,i)=>{const m=mk(new T.TorusGeometry(.4+i*.008,.006,6,56),emi(new T.Color(c).getHex(),.6,.45));m.rotation.x=Math.PI/2;add(m,t=>{m.position.y=.9+Math.sin(t/700+i*.7)*.75;m.rotation.z=t/1500+i})})}
  else{/* auras de couleur : particules lumineuses en hélice */const n=nm.includes("dor")?22:14,cc=new T.Color(col).getHex();for(let i=0;i<n;i++){const m=mk(new T.OctahedronGeometry(.045,0),emi(cc,1.3,.9)),ph=Math.random(),rad=.42+Math.random()*.3;add(m,t=>{const k=((t/3200+ph)%1),a=k*9+ph*6;m.position.set(Math.cos(a)*rad,.05+k*1.9,Math.sin(a)*rad);m.rotation.set(t/300,t/400,0);m.scale.setScalar(Math.sin(k*3.14)*1.2)})}}
  g.userData.tick=t=>ps.forEach(p=>p[1](t));return g}
/* ---- cheveux gonflés : la silhouette exacte des cheveux du dessin 2D (dessin avec cheveux moins dessin chauve) est « gonflée » en volume (surface avant + surface arrière), comme un ballon ----
   toutes les coiffures marchent (long, afro, chignon, nattes, voile…) puisque la forme vient du dessin lui-même */
/* ---- cheveux : coque 3D enveloppant vraiment le crâne (longitude/latitude, une seule surface fermée) ----
   devant : la forme vient du dessin 2D ; derrière : même forme en miroir + la ligne basse de la nuque relevée sur les côtés ; volumes qui dépassent (afro, chignon…) : rayon agrandi dans la même direction */
function buildShell(M,DA,W,Hh,avgC,r){const T=H(),NL=120,NT=60,PI=Math.PI,la0=-72*PI/180,la1=PI/2;
  const inM=(x,y)=>{const xi=Math.round(110+x),yi=Math.round(143-y);return xi>=0&&yi>=0&&xi<W&&yi<Hh&&M[yi*W+xi]===1};
  const colAt=(x,y)=>{const xi=Math.max(0,Math.min(W-1,Math.round(110+x))),yi=Math.max(0,Math.min(Hh-1,Math.round(143-y))),i=(yi*W+xi)*4;return[DA[i]/255,DA[i+1]/255,DA[i+2]/255]};
  /* profil radial de la silhouette des cheveux (jusqu'où ils dépassent du crâne, selon la direction) */
  const NB=180,Rp=new Float32Array(NB).fill(62);for(let y=0;y<Hh;y++)for(let x=0;x<W;x++)if(M[y*W+x]){const dx=x-110,dy=143-y,b=Math.floor((Math.atan2(dy,dx)+PI)/(2*PI)*NB)%NB,d=Math.hypot(dx,dy);if(d>Rp[b])Rp[b]=d}
  const Rs=new Float32Array(NB);for(let b=0;b<NB;b++){let m=62;for(let k=-3;k<=3;k++)m=Math.max(m,Rp[(b+k+NB)%NB]*(1-Math.abs(k)*.06));Rs[b]=m}
  const fAt=(x,y)=>{const b=Math.floor((Math.atan2(y,x)+PI)/(2*PI)*NB)%NB;return Math.min(2.4,Rs[b]/62)};
  /* ligne basse des cheveux sur les côtés (sert pour l'arrière de la tête) */
  let latBack=PI/2;for(let ps=55;ps<=88;ps+=3)for(let la=-70;la<=90;la+=2){const l=la*PI/180,x=62*Math.cos(l)*Math.sin(ps*PI/180),y=62*Math.sin(l);if(inM(x,y)||inM(-x,y)){if(l<latBack)latBack=l;break}}
  latBack=Math.max(la0+.12,Math.min(latBack,40*PI/180)-22*PI/180);
  const cov=new Uint8Array(NL*(NT+1)),LA=j=>la0+(la1-la0)*j/NT,PS=i=>i/NL*2*PI-PI;
  for(let j=0;j<=NT;j++)for(let i=0;i<NL;i++){const ps=PS(i),la=LA(j),front=Math.cos(ps)>=0,pm=front?ps:(ps>0?PI-ps:-PI-ps),x=62*Math.cos(la)*Math.sin(pm),y=62*Math.sin(la);
    let c=inM(x,y)||(Math.abs(Math.sin(ps))>.99&&inM(x*.98,y));if(!front&&la>=latBack)c=true;cov[j*NL+i]=c?1:0}
  /* distance au bord (en cases) pour que la coque s'amincisse vers sa limite et se pose sur la tête */
  const dist=new Float32Array(NL*(NT+1));for(let k=0;k<dist.length;k++)dist[k]=cov[k]?99:0;
  const sweep=(js,je,jd,is,ie,id)=>{for(let j=js;j!==je;j+=jd)for(let i=is;i!==ie;i+=id){const k=j*NL+i;if(!cov[k])continue;let d=dist[k];for(const[dj,di]of[[-jd,0],[0,-id],[-jd,-id],[-jd,id]]){const jj=j+dj;if(jj<0||jj>NT)continue;const ii=(i+di+NL)%NL;d=Math.min(d,dist[jj*NL+ii]+(dj&&di?1.4:1))}if(j===NT)d=Math.min(d,99);dist[k]=d}};
  sweep(0,NT+1,1,0,NL,1);sweep(NT,-1,-1,NL-1,-1,-1);sweep(0,NT+1,1,NL-1,-1,-1);sweep(NT,-1,-1,0,NL,1);
  const pos=[],col=[],idx=[],vid=new Int32Array(NL*(NT+1)).fill(-1);
  for(let j=0;j<NT;j++)for(let i=0;i<NL;i++){const k=j*NL+i;if(!cov[k])continue;const ps=PS(i),la=LA(j),front=Math.cos(ps)>=0,pm=front?ps:(ps>0?PI-ps:-PI-ps),x=Math.cos(la)*Math.sin(pm),y=Math.sin(la),f=fAt(x,y),tk=Math.min(1,dist[k]/3),back=Math.max(0,-Math.cos(ps));
    let R=r*(1.012+.03*tk)*(1+(f-1)*Math.min(1,tk*1.2)*Math.max(0,Math.min(1,(la+.15)/.7)));R*=1+.05*P.hairBV*back*tk;R+=r*P.hair*.5*Math.sin(ps*37+la*5)*Math.min(1,Math.max(0,(dist[k]-3)/4));
    pos.push(R*Math.cos(la)*Math.sin(ps),R*Math.sin(la),R*Math.cos(la)*Math.cos(ps));
    let c=[avgC.r,avgC.g,avgC.b];if(front){const px=62*x,py=62*y;if(inM(px,py)){const q=colAt(px,py),w=Math.min(1,Math.cos(ps)*3);c=[c[0]+(q[0]-c[0])*w,c[1]+(q[1]-c[1])*w,c[2]+(q[2]-c[2])*w]}}
    const sh=.92+.12*Math.sin(ps*29+la*3);col.push(Math.pow(Math.min(1,c[0]*sh),2.2),Math.pow(Math.min(1,c[1]*sh),2.2),Math.pow(Math.min(1,c[2]*sh),2.2));vid[k]=pos.length/3-1}
  /* pôle (dessus du crâne), un seul sommet : pas de couture visible */
  let pole=-1;{const k=(NT-1)*NL;let all=true;for(let i=0;i<NL;i++)if(!cov[k+i]){all=false;break}if(all){const f=fAt(0,1),R=r*(1.04)*(1+(f-1));pos.push(0,R,0);col.push(Math.pow(avgC.r,2.2),Math.pow(avgC.g,2.2),Math.pow(avgC.b,2.2));pole=pos.length/3-1}}
  for(let j=0;j<NT-1;j++)for(let i=0;i<NL;i++){const a=vid[j*NL+i],b=vid[j*NL+(i+1)%NL],c=vid[(j+1)*NL+i],d=vid[(j+1)*NL+(i+1)%NL];if(a<0||b<0||c<0||d<0)continue;idx.push(a,c,b,b,c,d)}
  if(pole>=0)for(let i=0;i<NL;i++){const a=vid[(NT-1)*NL+i],b=vid[(NT-1)*NL+(i+1)%NL];if(a>=0&&b>=0)idx.push(a,pole,b)}
  if(!idx.length)return null;
  const ge=new T.BufferGeometry();ge.setAttribute("position",new T.Float32BufferAttribute(pos,3));ge.setAttribute("color",new T.Float32BufferAttribute(col,3));ge.setIndex(idx);ge.computeVertexNormals();
  const m=new T.Mesh(ge,new T.MeshStandardMaterial({vertexColors:true,roughness:.62,metalness:.03,flatShading:!!P.flat,side:T.DoubleSide}));m.castShadow=true;const g=new T.Group();g.add(m);return g}
function mkHairVol(av,r,hairC){const T=H(),top=av[AVK.top]|0;if(top<=0)return null;const A=slHeadImg(av),B=slHeadImg(Object.assign({},av,{[AVK.top]:0}));if(!A.ok||!B.ok)return null;
  const W=220,Hh=212,rd=img=>{const c=document.createElement("canvas");c.width=W;c.height=Hh;const x=c.getContext("2d");x.drawImage(img,0,0,W,Hh);return x.getImageData(0,0,W,Hh)},DA=rd(A.img),DB=rd(B.img),M=new Uint8Array(W*Hh);let n=0;
  const oc=document.createElement("canvas");oc.width=W;oc.height=Hh;const ox=oc.getContext("2d"),OD=ox.createImageData(W,Hh);
  for(let i=0;i<W*Hh;i++){const a=DA.data[i*4+3],b=DB.data[i*4+3],df=Math.abs(DA.data[i*4]-DB.data[i*4])+Math.abs(DA.data[i*4+1]-DB.data[i*4+1])+Math.abs(DA.data[i*4+2]-DB.data[i*4+2]);
    if(a>40&&(b<40||df>45)){M[i]=1;n++;OD.data[i*4]=DA.data[i*4];OD.data[i*4+1]=DA.data[i*4+1];OD.data[i*4+2]=DA.data[i*4+2];OD.data[i*4+3]=255}}
  /* lissage de la silhouette : supprime la « crête » (pointes et tufts) vue de dos ou de profil, la forme reste celle du dessin */
  if(n>=30){let F=new Float32Array(W*Hh),G=new Float32Array(W*Hh);for(let i=0;i<W*Hh;i++)F[i]=M[i];
    for(let pass=0;pass<2;pass++){const R=4;for(let y=0;y<Hh;y++){let acc=0;for(let x=-R;x<=R;x++)acc+=F[y*W+Math.max(0,Math.min(W-1,x))];for(let x=0;x<W;x++){G[y*W+x]=acc/(2*R+1);acc+=F[y*W+Math.min(W-1,x+R+1)]-F[y*W+Math.max(0,x-R)]}}
      for(let x=0;x<W;x++){let acc=0;for(let y=-R;y<=R;y++)acc+=G[Math.max(0,Math.min(Hh-1,y))*W+x];for(let y=0;y<Hh;y++){F[y*W+x]=acc/(2*R+1);acc+=G[Math.min(Hh-1,y+R+1)*W+x]-G[Math.max(0,y-R)*W+x]}}}
    const hc=new T.Color(hairC);n=0;for(let i=0;i<W*Hh;i++){const m2=F[i]>.52;if(m2){n++;if(!M[i]){OD.data[i*4]=Math.round(hc.r*255);OD.data[i*4+1]=Math.round(hc.g*255);OD.data[i*4+2]=Math.round(hc.b*255);OD.data[i*4+3]=255}}else OD.data[i*4+3]=0;M[i]=m2?1:0}}
  if(n<30)return null;ox.putImageData(OD,0,0);
  const ac=document.createElement("canvas");ac.width=W;ac.height=Hh;const ax=ac.getContext("2d"),AD=ax.createImageData(W,Hh);for(let i=0;i<W*Hh;i++){const v=M[i]?255:0;AD.data[i*4]=AD.data[i*4+1]=AD.data[i*4+2]=v;AD.data[i*4+3]=255}ax.putImageData(AD,0,0);const am=new T.CanvasTexture(ac);
  /* distance au bord (chanfrein) : sert à gonfler la forme */
  const D=new Float32Array(W*Hh);for(let i=0;i<W*Hh;i++)D[i]=M[i]?1e9:0;
  for(let y=0;y<Hh;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!M[i])continue;let d=D[i];if(x>0)d=Math.min(d,D[i-1]+1);if(y>0){d=Math.min(d,D[i-W]+1);if(x>0)d=Math.min(d,D[i-W-1]+1.414);if(x<W-1)d=Math.min(d,D[i-W+1]+1.414)}D[i]=d}
  let mx=0;for(let y=Hh-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;if(!M[i])continue;let d=D[i];if(x<W-1)d=Math.min(d,D[i+1]+1);if(y<Hh-1){d=Math.min(d,D[i+W]+1);if(x<W-1)d=Math.min(d,D[i+W+1]+1.414);if(x>0)d=Math.min(d,D[i+W-1]+1.414)}D[i]=d;if(d>mx)mx=d}
  let sr=0,sg=0,sb=0,sn=0;for(let i=0;i<W*Hh;i++)if(M[i]){sr+=OD.data[i*4];sg+=OD.data[i*4+1];sb+=OD.data[i*4+2];sn++}const avgC=sn?new T.Color(sr/sn/255,sg/sn/255,sb/sn/255):new T.Color(hairC);
  let EA=62,EB=62;for(let y=0;y<Hh;y++)for(let x=0;x<W;x++)if(M[y*W+x]&&143-y>0){EA=Math.max(EA,Math.abs(x-110));EB=Math.max(EB,143-y)}
  const Dm=Math.max(6,Math.min(30,mx*.9))*P.hairS,k=r/62,st=2,nx=Math.floor(W/st)+1,ny=Math.floor(Hh/st)+1,tx=new T.CanvasTexture(oc);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=4;
  return buildShell(M,DA.data,W,Hh,avgC,r)}
/* ---- cheveux longs derrière la tête : nappe de mèches qui épouse l'arrière du crâne puis retombe dans le dos (plus longue pour les filles) ---- */
function mkHairBack(av,r,hairC){const T=H(),tn=topName(av),lg=slLong(tn),fem=(av.gen|0)===1;let len=lg?(fem?.75:.5):(fem?.22:0);len*=P.hairBack;if(len<=.01)return null;
  const g=new T.Group(),cols=24,rowsN=22,span=1.8;
  for(let layer=0;layer<2;layer++){const pos=[],idx=[],L=len*(layer?.82:1),lay=layer?.035:0;
    for(let j=0;j<=cols;j++){const u=j/cols,ps=Math.PI+(u*2-1)*span,tip=.1*Math.abs(Math.sin(u*Math.PI*7+layer))*r+.02*r*Math.cos(u*31),yTop=r*.85,yEnd=-r*(.9+3.4*L)-tip;
      for(let i=0;i<=rowsN;i++){const t=i/rowsN,y=yTop+(yEnd-yTop)*t;let rho;if(y>-.34*r)rho=Math.sqrt(Math.max(0,r*r-y*y))*1.05;else{const k=Math.min(1,(-.34*r-y)/(.8*r));rho=Math.sqrt(r*r-.34*r*.34*r)*1.05*(1-k)+.82*r*k}
        rho+=r*(lay+.014*Math.sin(u*cols*3.1)*(layer?.7:1));const edge=1-Math.pow(Math.abs(u*2-1),6)*.25;
        pos.push(Math.sin(ps)*rho*edge,y,Math.cos(ps)*rho*edge)}}
    for(let j=0;j<cols;j++)for(let i=0;i<rowsN;i++){const a=j*(rowsN+1)+i,b=a+1,c=a+rowsN+1,d=c+1;idx.push(a,b,c,b,d,c)}
    const ge=new T.BufferGeometry();ge.setAttribute("position",new T.Float32BufferAttribute(pos,3));ge.setIndex(idx);ge.computeVertexNormals();
    const m=new T.Mesh(ge,new T.MeshStandardMaterial({color:new T.Color(hairC).multiplyScalar(layer?1.06:.88),roughness:.68,metalness:.03,flatShading:true,side:T.DoubleSide}));m.castShadow=true;g.add(m)}
  return g}
let _hairG=null;
function mkHair(av,r,hairC,mk){const T=H(),g=new T.Group(),lg=slLong(topName(av)),mc=mk.getContext("2d").getImageData(0,0,1024,512).data;
  const base=new T.Color(hairC),mats=[.82,.92,1,1.1,1.2].map(k=>new T.MeshStandardMaterial({color:base.clone().multiplyScalar(k),roughness:.62,metalness:.05,flatShading:true,side:T.DoubleSide}));
  const gcache={};const lockGeo=(L,w,th)=>{const key=L.toFixed(2)+"_"+w.toFixed(2)+"_"+th.toFixed(3);if(gcache[key])return gcache[key];const sh=new T.Shape();sh.moveTo(-w/2,0);sh.quadraticCurveTo(-w*.62,L*.5,0,L);sh.quadraticCurveTo(w*.62,L*.5,w/2,0);sh.closePath();
    const ge=new T.ExtrudeGeometry(sh,{depth:th,bevelEnabled:true,bevelSize:th*.4,bevelThickness:th*.4,bevelSegments:1,curveSegments:5}),pp=ge.attributes.position;
    for(let i=0;i<pp.count;i++){const y=pp.getY(i);pp.setZ(i,pp.getZ(i)-y*y/(2*r)*1.05)}ge.computeVertexNormals();return gcache[key]=ge};
  const rowsLat=[];for(let la=84;la>=-40;la-=10)rowsLat.push(la);let cnt=0;
  rowsLat.forEach((laD,ri)=>{const la=laD*Math.PI/180,nLon=Math.max(6,Math.round(26*Math.cos(la)+4)),off=(ri%2)*.5;
    for(let j=0;j<nLon;j++){const ps=((j+off)/nLon)*Math.PI*2-Math.PI,px=Math.round(256+ps/(Math.PI*2)*1024+1024)%1024,py=Math.round(256-la/Math.PI*512);if(py<0||py>=512)continue;
      if(mc[(py*1024+px)*4]<110)continue;
      if(Math.cos(ps)>.35&&laD<70)continue;
      const back=Math.cos(ps)<0,L=(lg&&back&&laD<30?r*(.55+.5*Math.random()+(30-laD)/60):r*(.26+.18*Math.random()))*P.hairS,w=r*(.2+.06*Math.random()),th=r*P.hair*(.8+.4*Math.random());
      const n=new T.Vector3(Math.cos(la)*Math.sin(ps),Math.sin(la),Math.cos(la)*Math.cos(ps)),d=new T.Vector3(Math.sin(la)*Math.sin(ps),-Math.cos(la),Math.sin(la)*Math.cos(ps));
      if(laD>78){d.set(Math.sin(j*1.7),0,Math.cos(j*1.7)).normalize()}
      const X=new T.Vector3().crossVectors(d,n).normalize(),m=new T.Matrix4().makeBasis(X,d,n),o=new T.Mesh(lockGeo(L,w,th),mats[(ri*3+j*7)%5]);
      o.position.copy(n).multiplyScalar(r*.985);o.setRotationFromMatrix(m);o.castShadow=true;g.add(o);cnt++}});
  /* devant : une mèche tous les ~8 points du dessin où il y a des cheveux (au-dessus des sourcils), donc la frange et le volume ont la forme du vrai personnage */
  const IM=window._lab3dImg;if(IM){const sk=[parseInt(skinHex(av).slice(1,3),16),parseInt(skinHex(av).slice(3,5),16),parseInt(skinHex(av).slice(5,7),16)],k=r/62,k2=IM.w/220;let fr=0;
    for(let v=88;v>=-10;v-=7)for(let u=-100;u<=100;u+=7){const jx=u+((v*7+u*3)%5-2),jy=v+((u*5+v)%5-2),xi=Math.round((110+jx)*k2),yi=Math.round((143-jy)*k2);if(xi<0||yi<0||xi>=IM.w||yi>=IM.h)continue;const si=(yi*IM.w+xi)*4,D=IM.SD.data;
      if(D[si+3]<40)continue;if(Math.abs(D[si]-sk[0])+Math.abs(D[si+1]-sk[1])+Math.abs(D[si+2]-sk[2])<70)continue;if(jy<30&&Math.abs(jx)<54)continue;if(jy<8)continue;
      const r2=jx*jx+jy*jy,z=r2<62*62?Math.sqrt(62*62-r2):16,n=new T.Vector3(jx,jy,z).normalize(),pos=new T.Vector3(jx*k,jy*k,z*k*(r2<62*62?1:1)),dn=new T.Vector3(0,-1,0);dn.sub(n.clone().multiplyScalar(dn.dot(n))).normalize();
      const L=r*(.28+.3*Math.min(1,Math.max(0,(jy-30)/60))+.08*((u*3+v)%3)),w=r*.24,th=r*P.hair*1.1,X=new T.Vector3().crossVectors(dn,n).normalize(),m=new T.Matrix4().makeBasis(X,dn,n),o=new T.Mesh(lockGeo(L*P.hairS,w,th),mats[(fr*3+u)%5>=0?Math.abs(fr*3+u)%5:0]);
      pos.add(n.clone().multiplyScalar(r*.02));o.position.copy(pos);o.setRotationFromMatrix(m);o.castShadow=true;g.add(o);fr++}}
  return g}
const skinHex=av=>/^#[0-9a-f]{6}$/i.test(av[AVK.skinColor]||"")?av[AVK.skinColor]:"#f1c27d";
function rbox(w,h,d,rad,seg){const T=H();rad=Math.max(.001,Math.min(rad*P.round,Math.min(w,h,d)/2-.002));const g=new T.BoxGeometry(w,h,d,seg,seg,seg),p=g.attributes.position,hw=w/2-rad,hh=h/2-rad,hd=d/2-rad,v=new T.Vector3(),q=new T.Vector3();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);q.set(Math.max(-hw,Math.min(hw,v.x)),Math.max(-hh,Math.min(hh,v.y)),Math.max(-hd,Math.min(hd,v.z)));v.sub(q);if(v.lengthSq()>0){v.normalize().multiplyScalar(rad);p.setXYZ(i,q.x+v.x,q.y+v.y,q.z+v.z)}}
  g.computeVertexNormals();return g}
function tex(img){const T=new (H().Texture)(img);T.colorSpace=H().SRGBColorSpace;T.anisotropy=4;T.needsUpdate=true;return T}
/* tranches empilées : donne de l'épaisseur à une image plate vue de profil */
function slab(img,w,h,n,th,bendR,vb,bump){const g=new (H().Group)(),T=tex(img);n=Math.max(1,Math.round(n));if(th>0)n=Math.min(44,Math.max(n,Math.ceil(th/.005)+1));
  for(let i=0;i<n;i++){const f=n===1?0:i/(n-1)-.5,sh=1-Math.abs(f)*.55,geo=new (H().PlaneGeometry)(w,h,(bendR||vb)?32:1,1);
    if(bendR){const p=geo.attributes.position;for(let j=0;j<p.count;j++){const x=p.getX(j),q=Math.max(0,1-Math.min(1,Math.abs(x)/bendR)**2);p.setZ(j,Math.sqrt(q)*bendR)}geo.computeVertexNormals()}
    if(vb){const p=geo.attributes.position;for(let j=0;j<p.count;j++){const x=Math.abs(p.getX(j))/(w/2);p.setZ(j,p.getZ(j)-Math.pow(x,1.4)*vb)}geo.computeVertexNormals()}
    const m=new (H().MeshStandardMaterial)({map:T,transparent:true,alphaTest:.06,side:H().DoubleSide,roughness:1,metalness:0,color:new (H().Color)(sh,sh,sh),bumpMap:bump?T:null,bumpScale:bump||0}),pl=new (H().Mesh)(geo,m);pl.position.z=f*th;pl.castShadow=false;g.add(pl)}
  return g}
function headTexture(av,hairC,skinC){const cv=document.createElement("canvas");cv.width=1024;cv.height=512;const c=cv.getContext("2d");
  const bald=!(av[AVK.top]|0);c.fillStyle=bald?skinC:hairC;c.fillRect(0,0,1024,512);if(!bald){c.fillStyle=skinC;c.fillRect(0,430,1024,82)}
  const hd=slHeadImg(av);if(hd.ok){const sc=document.createElement("canvas");sc.width=hd.img.naturalWidth||440;sc.height=hd.img.naturalHeight||424;const sx=sc.getContext("2d");sx.drawImage(hd.img,0,0,sc.width,sc.height);const SD=sx.getImageData(0,0,sc.width,sc.height);window._lab3dImg={SD:SD,w:sc.width,h:sc.height};const D=c.getImageData(0,0,1024,512),k2=sc.width/220,half=P.faceArc*Math.PI/360;
    for(let py=0;py<512;py++){const ph=(256-py)/512*Math.PI,cp=Math.cos(ph),sp=Math.sin(ph);for(let px=0;px<1024;px++){const ps=(px-256)/1024*Math.PI*2;if(ps<-half||ps>half)continue;
      const x=(110+62*cp*Math.sin(ps))*k2,y=(143-62*sp)*k2,xi=x|0,yi=y|0;if(xi<0||yi<0||xi>=sc.width||yi>=sc.height)continue;const si=(yi*sc.width+xi)*4,al=SD.data[si+3]/255;if(al<.02)continue;const di=(py*1024+px)*4;
      D.data[di]=D.data[di]*(1-al)+SD.data[si]*al;D.data[di+1]=D.data[di+1]*(1-al)+SD.data[si+1]*al;D.data[di+2]=D.data[di+2]*(1-al)+SD.data[si+2]*al}}
    c.putImageData(D,0,0);
    /* masque de relief : cheveux = 1 (avec mèches), peau/visage = 0 */
    const m=document.createElement("canvas");m.width=1024;m.height=512;const mc=m.getContext("2d"),MD=mc.createImageData(1024,512),sk=[parseInt(skinC.slice(1,3),16),parseInt(skinC.slice(3,5),16),parseInt(skinC.slice(5,7),16)];
    for(let py=0;py<512;py++){const ph=(256-py)/512*Math.PI,cp=Math.cos(ph),sp=Math.sin(ph);for(let px=0;px<1024;px++){const ps=(px-256)/1024*Math.PI*2;let hv=0;const di=(py*1024+px)*4;
      if(ps<-half||ps>half||ps>Math.PI||ps<-Math.PI){hv=ph>-.45?1:0}else if(ph>.5){const x=(110+62*cp*Math.sin(ps))*k2,y=(143-62*sp)*k2,xi=x|0,yi=y|0;if(xi>=0&&yi>=0&&xi<sc.width&&yi<sc.height){const si=(yi*sc.width+xi)*4;if(SD.data[si+3]>10&&Math.abs(SD.data[si]-sk[0])+Math.abs(SD.data[si+1]-sk[1])+Math.abs(SD.data[si+2]-sk[2])>70)hv=1}}
      const v=hv?Math.round(255*(.5+.5*(.5+.5*Math.sin(px*.42+Math.sin(py*.045)*3.2)))):0;MD.data[di]=MD.data[di+1]=MD.data[di+2]=v;MD.data[di+3]=255}}
    mc.putImageData(MD,0,0);const mk=document.createElement("canvas");mk.width=1024;mk.height=512;const kc=mk.getContext("2d");kc.filter="blur(1.5px)";kc.drawImage(m,0,0);window._lab3dMask=mk}
  const T=new (H().CanvasTexture)(cv);T.colorSpace=H().SRGBColorSpace;T.anisotropy=4;return T}
function auraColor(av){const n=AUR[(av.aur|0)-1],nm=(n&&n[0]||"").toLowerCase();let c="#ffe27a";if(/verte/.test(nm))c="#2bd66b";else if(/bleue/.test(nm))c="#2f7fe0";else if(/violette/.test(nm))c="#9b3be0";else if(/dor/.test(nm))c="#ffc400";else if(/flamme/.test(nm))c="#ff5a14";else if(/éclair|eclair/.test(nm))c="#ffe14a";return c}
function glowTex(c0){const cv=document.createElement("canvas");cv.width=cv.height=256;const c=cv.getContext("2d"),g=c.createRadialGradient(128,128,10,128,128,126);g.addColorStop(0,c0+"cc");g.addColorStop(.45,c0+"55");g.addColorStop(1,c0+"00");c.fillStyle=g;c.fillRect(0,0,256,256);return new (H().CanvasTexture)(cv)}
function build(av){const T=H();if(char){root.remove(char);char.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  char=new T.Group();flap=[];aura=null;auraG=null;objList=[];objPiv=null;const skin=col(av[AVK.skinColor]||"#f1c27d"),hairC=col(av[AVK.hairColor]||"#4a312c"),cl=slOutfitColor(av),pants="#465c96",shoe="#2a2f45";
  const holdOb=false,BS=Math.max(1,Math.round(P.bseg)),fl=!!P.flat,M=(c,r)=>new T.MeshStandardMaterial({color:c,roughness:r===undefined?.8:r,metalness:0,flatShading:fl,emissive:new T.Color(c).multiplyScalar(.12)});
  const legH=.5*P.legs,torH=.46*P.torso,tw=.5*P.width,td=.3*P.depth,r=.3*P.head,neck=.04,k=r/62;
  const add=(m,x,y,z)=>{m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;char.add(m);return m};
  /* jambes, chaussures */
  [-1,1].forEach(s=>{add(new T.Mesh(rbox(.15*P.width,legH-.07,.17*P.depth,.05,BS),M(pants)),s*.1*P.width,.07+(legH-.07)/2,0);add(new T.Mesh(rbox(.17*P.width,.07,.24*P.depth,.03,BS),M(shoe)),s*.1*P.width,.035,.03)});
  /* buste (face avant = tenue de collection si elle existe) */
  const mid=slLayerImg(av,"mid"),bm=M(cl),mats=[bm,bm,bm,bm,bm,bm];
  if(mid.ok&&mid.img){const mt=new T.MeshStandardMaterial({map:tex(mid.img),roughness:.8,flatShading:fl});mats[4]=mt}
  add(new T.Mesh(rbox(tw,torH,td,.09,BS),mats),0,legH+torH/2,0);
  /* bras + mains */
  const gOn=(av.obj>0&&OBJ[av.obj-1]&&/Guitare/.test(OBJ[av.obj-1][1])),GT={1:[.1,legH+torH*.1,td/2+.2],"-1":[-.28,legH+torH*.1+.33,td/2+.2]};
  [-1,1].forEach(s=>{const ah=torH*.83,ax=s*(tw/2+.06*P.width),cap=new T.Mesh(new T.CapsuleGeometry(.055*P.width,ah-.11,Math.max(2,BS),Math.max(6,BS*2)),M(cl));
    if(gOn){const S0=new T.Vector3(ax,legH+torH*.9,0),Tg=new T.Vector3(...GT[s]),V=Tg.clone().sub(S0),Lv=V.length();cap.scale.y=Lv/ah;cap.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),V.clone().normalize());cap.position.copy(S0.clone().add(Tg).multiplyScalar(.5));cap.castShadow=true;char.add(cap);
      add(new T.Mesh(new T.SphereGeometry(.068,Math.max(6,BS*2),Math.max(5,BS)),M(skin,.7)),Tg.x,Tg.y,Tg.z);return}
    add(cap,ax,legH+torH*.95-ah/2,0);if(!(s===1&&holdOb))add(new T.Mesh(new T.SphereGeometry(.068,Math.max(6,BS*2),Math.max(5,BS)),M(skin,.7)),ax,legH+torH*.1,0)});
  /* cou + tête (sphère à facettes réglables, texture = vrai visage DiceBear) */
  add(new T.Mesh(new T.CylinderGeometry(.06,.07,neck+.04,Math.max(6,BS*2)),M(skin,.7)),0,legH+torH+neck/2,0);
  const hy=legH+torH+neck+r*.95,head=new T.Group();head.position.set(0,hy,0);char.add(head);
  window._lab3dMask=null;const hmap=headTexture(av,hairC,skin),mk=window._lab3dMask,mt=mk?new T.CanvasTexture(mk):null,hm=new T.MeshStandardMaterial({map:hmap,emissive:0xffffff,emissiveMap:hmap,emissiveIntensity:.14,roughness:.75,metalness:0,flatShading:fl,}),hs=new T.Mesh(new T.SphereGeometry(r,Math.round(P.segs),Math.max(4,Math.round(P.segs*.75))),hm);hs.castShadow=true;head.add(hs);
  /* cheveux : des centaines de mèches (lames effilées) qui épousent le crâne et retombent ; elles n'existent que là où l'avatar a des cheveux (masque) */
  {const hv=mkHairVol(av,r,hairC);if(hv){head.add(hv);const hb=mkHairBack(av,r,hairC);if(hb)head.add(hb)}}
  /* chapeau / accessoire de cheveux, lunettes (bombées sur le visage) */
  const hacN=((HAC[(av.hac|0)-1]||[""])[0]||"").toLowerCase(),isCrown=av.hat===5,isHalo=/aur/.test(hacN),isWreath=/couronne de (fleurs|laurier)/.test(hacN),gold=new T.MeshStandardMaterial({color:0xf3c623,metalness:.85,roughness:.28,emissive:0x5a3d00,flatShading:fl});
  /* couronne, auréole, couronnes végétales : vrais objets 3D posés à plat sur la tête (pas des images) */
  if(isCrown){const cg=new T.Group(),R=r*.72,n=7;cg.add(new T.Mesh(new T.CylinderGeometry(R,R*.95,r*.3,Math.max(12,n*4),1,true),new T.MeshStandardMaterial({color:0xf3c623,metalness:.85,roughness:.28,emissive:0x5a3d00,side:T.DoubleSide})));for(let i=0;i<n;i++){const a=i/n*Math.PI*2,sp=new T.Mesh(new T.ConeGeometry(r*.1,r*.32,8),gold);sp.position.set(Math.cos(a)*R,r*.3,Math.sin(a)*R);cg.add(sp);const jw=new T.Mesh(new T.SphereGeometry(r*.05,10,8),new T.MeshStandardMaterial({color:i%2?0xd22:0x2a6ad8,metalness:.3,roughness:.2}));jw.position.set(Math.cos(a)*R*1.01,0,Math.sin(a)*R*1.01);cg.add(jw)}const hh0=(av[AVK.top]|0)>0;cg.position.y=r*(hh0?.86:.68);cg.scale.setScalar(hh0?1.12:1);cg.rotation.x=-.08;head.add(cg)}
  if(isHalo){const hg=new T.Mesh(new T.TorusGeometry(r*.72,r*.06,14,Math.max(24,P.segs)),new T.MeshStandardMaterial({color:0xffe58a,emissive:0xffc400,emissiveIntensity:1.3,metalness:.3,roughness:.3}));hg.rotation.x=Math.PI/2;hg.position.y=r*1.42;head.add(hg);flap.push({halo:hg})}
  if(isWreath){const wg2=new T.Group(),lau=/laurier/.test(hacN);const R=r*.78,n=lau?18:12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,m2=new T.Mesh(lau?new T.SphereGeometry(r*.09,10,8):new T.SphereGeometry(r*.075,10,8),new T.MeshStandardMaterial({color:lau?0x4f8f3a:[0xff8fb8,0xffe066,0xffffff][i%3],roughness:.6}));if(lau)m2.scale.set(1,.5,1.9);m2.position.set(Math.cos(a)*R,0,Math.sin(a)*R);m2.rotation.y=-a;wg2.add(m2)}wg2.position.y=r*.62;head.add(wg2)}
  const hat=(isCrown||isHalo||isWreath)?{ok:false}:slLayerImg(av,"hat");if(hat.ok&&hat.img){const s=340*k*P.hatS,g=slab(hat.img,s,s,P.slices,P.thick*r*6);g.position.set(0,-20*k,0);head.add(g)}
  const fc=slLayerImg(av,"face");if(fc.ok&&fc.img){const s=340*k*P.hatS,g=slab(fc.img,s,s,1,0,r*1.005);g.position.set(0,-20*k,0);head.add(g)}
  /* ailes / cape dans le dos */
  const wst=av.wng>0?wingStyle(av):null;if(wst){const wgp=buildWings(av,tw,td,legH,torH,flap);if(wgp)char.add(wgp)}
  const wg=wst?{ok:false}:slLayerImg(av,"wings");if(wg.ok&&wg.img){const s=340*k*P.wing,g=slab(wg.img,s,s,6,.04,0,P.wbend*s,2.5);g.position.set(0,hy-20*k*0+(-20*k)-0,-td/2-.02+P.wback);g.position.y=hy-20*k;char.add(g);flap.push(g)}
  /* objet tenu dans la main (le point (226,245) de l'image = la main) */
  const on=av.obj>0&&OBJ[av.obj-1]?OBJ[av.obj-1][1].split(" · ")[0]:"";
  if(on==="Guitare"){const og=PROC[on]();og.scale.setScalar(.95*P.obj);og.rotation.z=.7;og.position.set(0,legH+torH*.1,td/2+.15);char.add(og);objList.push(og)}
  else if(PROC[on]){const og=PROC[on](),pv=new T.Group();const osc=P.obj*({"Trident":.66,"Épée":.78,"Sceptre magique":.72,"Drapeau chinois":.78,"Torche":.85,"Ballon":.8,"Trophée":.8,"Bouclier":.55,"Baguette":.6}[on]||1),OFF={"Mug":[-.085,-.035,0],"Pain au chocolat":[0,.07,0],"Pomme":[0,.05,0],"Fromage":[0,.04,0],"Livres":[0,.05,0],"Baguette":[0,-.1,0],"Verre de vin":[0,-.04,0],"Casque audio":[0,-.12,0],"Petit livre rouge":[0,.05,0],"Diamant":[0,.1,0],"Guitare":[0,-.45,0],"Tour Eiffel":[0,.04,0],"Bouclier":[-.12,-.18,0]}[on]||[0,0,0];og.scale.setScalar(osc);og.position.set(OFF[0]*osc,OFF[1]*osc,OFF[2]*osc);pv.add(og);pv.position.set(tw/2+.06*P.width+.04,legH+torH*.1,.03);pv.rotation.x=.12;pv.rotation.z=/Trident|Épée|Sceptre|Drapeau|Torche/.test(on)?-.3:-.05;char.add(pv);objList.push(pv)}
  const ob=PROC[on]?{ok:false}:slLayerImg(av,"obj");if(ob.ok&&ob.img){const k2=.0042*P.obj,W=540*k2,piv=new T.Group(),g=slab(ob.img,W,W,P.slices,P.thick*.5*P.obj);
    /* le dessin de l'objet contient déjà la main qui le tient : son point (226,245) est posé exactement au bout du bras, à la place de la main 3D */
    g.position.set(-76*k2,145*k2,0);piv.add(g);piv.position.set(tw/2+.06*P.width,legH+torH*.1,.03);char.add(piv);objPiv=piv;objList.push(piv)}
  /* aura : halo lumineux additif derrière le personnage */
  if(av.aur>0){const sp=new T.Sprite(new T.SpriteMaterial({map:glowTex(auraColor(av)),transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.9*P.glow}));sp.scale.set(2.2,2.2,1);sp.position.set(0,hy-.1,-.05);char.add(sp);aura=sp;auraG=mkAura(av,hy);char.add(auraG)}
  root.add(char);return char}
function applyDir(){if(char)char.rotation.y=(2-dir)*Math.PI/4}
function layout(){const w=ov.clientWidth,h=ov.clientHeight,cv=ren.domElement;ren.setSize(w,h,false);cam.aspect=w/h;cam.fov=P.fov;cam.updateProjectionMatrix()}
function camPos(){const T=H(),d=7.5,el=P.tilt*Math.PI/180;cam.position.set(Math.sin(az)*Math.cos(el)*d,1.0+Math.sin(el)*d,Math.cos(az)*Math.cos(el)*d);cam.lookAt(0,.95,0)}
let amb,sun;
function frame(ts){raf=setTimeout(()=>frame(performance.now()),33);if(!ren)return;const t=ts;cam.fov=P.fov;cam.updateProjectionMatrix();camPos();amb.intensity=P.amb;sun.intensity=P.sun;
  if(aura){const p=1+.06*Math.sin(t/380);aura.scale.set(2.2*p,2.2*p,1);aura.material.opacity=(.75+.2*Math.sin(t/500))*P.glow}
  if(auraG)auraG.userData.tick(t);flap.forEach(g=>{if(g.wing){g.wing.rotation.y=g.s*(-.28-Math.sin(t/230)*.16);g.wing.rotation.z=g.s*Math.sin(t/230)*.05;return}if(g.halo){g.halo.position.y=g.halo.position.y;g.halo.rotation.z=t/900;return}const f=Math.sin(t/230);g.scale.set(1+.08*f,1+.03*f,1)});if(objPiv&&char)objPiv.rotation.y=Math.max(-1.3,Math.min(1.3,az-char.rotation.y));
  if(char)char.position.y=Math.sin(t/520)*.01;
  /* réessaie de construire tant que les images (SVG) ne sont pas toutes chargées */
  const sig=[slHeadImg(av0).ok,slHeadImg(Object.assign({},av0,{[AVK.top]:0})).ok,slLayerImg(av0,"hat").ok||slLayerImg(av0,"hat").empty,slLayerImg(av0,"face").ok||slLayerImg(av0,"face").empty,slLayerImg(av0,"wings").ok||slLayerImg(av0,"wings").empty,slLayerImg(av0,"obj").ok||slLayerImg(av0,"obj").empty,slLayerImg(av0,"mid").ok||slLayerImg(av0,"mid").empty].join();
  if(sig!==sigLoaded){sigLoaded=sig;try{build(av0);applyDir()}catch(e){console.error("lab3d build",e)}}
  ren.render(scene,cam)}
function rebuild(){sigLoaded="";}
function save(){try{localStorage.setItem("lab3d3",JSON.stringify(P))}catch(e){}}
function ui(){const dn=["E →","SE ↘","S ↓","SO ↙","O ←","NO ↖","N ↑","NE ↗"];
  ov.innerHTML=`<div style="position:absolute;inset:0"><canvas id="lab3c" style="width:100%;height:100%;display:block;touch-action:none;cursor:grab"></canvas></div>
  <div id="lab3p" style="position:absolute;top:0;right:0;bottom:0;width:min(330px,88vw);background:#0f1b33ee;color:#fff;overflow:auto;padding:10px;font:12px system-ui;transform:translateX(0);transition:transform .2s">
   <div style="display:flex;justify-content:space-between;align-items:center"><b>🧪 Labo 3D · 3D实验室</b><span><button onclick="lab3dClose()" style="font-size:14px">✕</button></span></div>
   <div style="margin:8px 0;display:flex;flex-wrap:wrap;gap:4px">${dn.map((n,i)=>`<button onclick="lab3dDir(${i})" style="padding:4px 7px">${n}</button>`).join("")}</div>
   <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px"><button onclick="lab3dAv(0)">Mon avatar</button><button onclick="lab3dAv(1)">Items au hasard</button><button onclick="lab3dReset()">↺ Défaut</button><button onclick="lab3dCopy()">📋 Copier</button></div>
   ${PI.map(([k,l,a,b,s])=>`<label style="display:block;margin:5px 0">${l} <b id="lv_${k}">${P[k]}</b><input type="range" min="${a}" max="${b}" step="${s}" value="${P[k]}" style="width:100%" oninput="lab3dSet('${k}',+this.value)"></label>`).join("")}
   <div style="opacity:.7;margin-top:8px">Glisse sur la scène pour tourner la caméra · 拖动旋转相机</div></div>`}
window.lab3dSet=(k,v)=>{P[k]=v;const o=document.getElementById("lv_"+k);if(o)o.textContent=v;save();if(["head","torso","legs","width","depth","bseg","round","segs","hair","hairS","hairBack","hairBV","flat","faceArc","slices","thick","obj","hatS","wing","wcurve","wback"].includes(k))rebuild()};
window.lab3dDir=i=>{dir=i;applyDir()};
window.lab3dReset=()=>{try{localStorage.removeItem("lab3d3")}catch(e){}lab3dClose();lab3dOpen()};
window.lab3dCopy=()=>{const t=JSON.stringify(P);if(navigator.clipboard)navigator.clipboard.writeText(t);toast("Copié · 已复制")};
window.lab3dAv=m=>{const b=(typeof avDone==="function"&&avDone(S.av))?Object.assign({},S.av):avStart();if(m){const pick=n=>1+Math.floor(Math.random()*n);b.hat=pick(HATS.length);b.wng=pick(WNG.length);b.obj=pick(OBJ.length);b.aur=pick(AUR.length);b.gls=pick(GLS.length)}av0=b;rebuild()};
window.lab3dItems=o=>{av0=Object.assign({},av0,o);rebuild()};
window.lab3dClose=()=>{clearTimeout(raf);raf=0;if(ren){ren.dispose();ren=null}if(ov){ov.remove();ov=null}char=null;document.body.style.overflow=""};
window.lab3dOpen=function(){if(ov)return;const go=()=>{const T=H();ov=document.createElement("div");ov.id="lab3";ov.style.cssText="position:fixed;inset:0;z-index:99998;background:linear-gradient(#bcd7ff,#e9f2ff 60%,#d9c9a8)";document.body.appendChild(ov);document.body.style.overflow="hidden";ui();
    const cv=document.getElementById("lab3c");ren=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});ren.setPixelRatio(Math.min(2,window.devicePixelRatio||1));ren.shadowMap.enabled=true;ren.shadowMap.type=T.PCFSoftShadowMap;
    scene=new T.Scene();cam=new T.PerspectiveCamera(P.fov,1,.1,50);root=new T.Group();scene.add(root);
    amb=new T.HemisphereLight(0xffffff,0xd8ccbc,P.amb);scene.add(amb);sun=new T.DirectionalLight(0xffffff,P.sun);sun.position.set(2.5,5,3.5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const sc=sun.shadow.camera;sc.left=-2;sc.right=2;sc.top=3;sc.bottom=-1;scene.add(sun);const fill=new T.DirectionalLight(0xfff4e6,.45);fill.position.set(-2.5,2.5,5);scene.add(fill);
    /* sol (cercle + ombre reçue) */
    const gr=new T.Mesh(new T.CircleGeometry(1.4,48),new T.ShadowMaterial({opacity:.35}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;root.add(gr);
    const tile=new T.Mesh(new T.CircleGeometry(1.4,48),new T.MeshBasicMaterial({color:0xc9b07a,transparent:true,opacity:.5}));tile.rotation.x=-Math.PI/2;tile.position.y=-.002;root.add(tile);
    av0=(typeof avDone==="function"&&avDone(S.av))?Object.assign({},S.av):avStart();layout();window.addEventListener("resize",()=>ov&&layout());
    cv.addEventListener("pointerdown",e=>{drag={x:e.clientX,a:az};cv.setPointerCapture(e.pointerId)});cv.addEventListener("pointermove",e=>{if(drag)az=drag.a-(e.clientX-drag.x)*.01});cv.addEventListener("pointerup",()=>drag=null);
    sigLoaded="";frame(performance.now())};
  if(H()){go();return}
  const s=document.createElement("script");s.src="three.min.js";s.onload=go;s.onerror=()=>toast("three.min.js introuvable");document.head.appendChild(s)};
/* ---- salon : les personnages sont rendus avec Three.js (une seule WebGL partagée), à peine pixelisés pour masquer les petits défauts ---- */
const SL3={r:null,cam:null,inst:new WeakMap(),ok:null,w:0,h:0,Q:.9,QO:.95};
function sl3Init(){if(SL3.ok!==null)return SL3.ok;try{const T=H(),cv=document.createElement("canvas");SL3.r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});SL3.r.setClearColor(0x000000,0);SL3.r.setPixelRatio(1);
  SL3.cam=new T.OrthographicCamera(-1.6,1.6,1.9,-1.15,.1,30);const el=20*Math.PI/180,d=9;SL3.cam.position.set(0,.95+Math.sin(el)*d,Math.cos(el)*d);SL3.cam.lookAt(0,.95,0);SL3.ok=true}catch(e){SL3.ok=false}return SL3.ok}
function sl3Sig(av){const L=k=>{const o=slLayerImg(av,k);return o.ok||o.empty?1:0};return[slHeadImg(av).ok?1:0,slHeadImg(Object.assign({},av,{[AVK.top]:0})).ok?1:0,L("hat"),L("face"),L("wings"),L("obj"),L("mid")].join("")}
function sl3Rebuild(I,av){const sR=root,sC=char,sF=flap,sA=aura,sG=auraG,sO=objPiv,sL=objList;
  if(I.char){I.scene.remove(I.char);I.char.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
  root=I.scene;char=null;I.char=null;try{build(av);I.char=char;I.flap=flap;I.aura=aura;I.auraG=auraG;I.obj=objPiv;I.objs=objList}catch(e){console.error("sl3 build",e)}
  root=sR;char=sC;flap=sF;aura=sA;auraG=sG;objPiv=sO;objList=sL}
function sl3Inst(e,av){const T=H();let I=SL3.inst.get(e);if(!I){const sc=new T.Scene();sc.add(new T.HemisphereLight(0xffffff,0xd8ccbc,P.amb));const sun=new T.DirectionalLight(0xffffff,P.sun);sun.position.set(2.5,5,3.5);sc.add(sun);const fl=new T.DirectionalLight(0xfff4e6,.45);fl.position.set(-2.5,2.5,5);sc.add(fl);I={scene:sc,sig:"",ld:"",chk:0,char:null};SL3.inst.set(e,I)}
  const now=performance.now();if(now-I.chk>350){I.chk=now;const sig=JSON.stringify(av),ld=sl3Sig(av);if(sig!==I.sig||ld!==I.ld){I.sig=sig;I.ld=ld;sl3Rebuild(I,av)}}return I}
window.sl3d={draw(c,p,u,e,t){if(!H()||!sl3Init())return;const av=e.isme?S.av:e.av;if(!av||Array.isArray(av))return;const I=sl3Inst(e,av);if(!I.char)return;
  /* ombre portée 2D (comme avant) */
  {const sg=c.createRadialGradient(p[0],p[1],1,p[0],p[1],u*.42);sg.addColorStop(0,"#0000007a");sg.addColorStop(1,"#00000000");c.fillStyle=sg;c.beginPath();c.ellipse(p[0],p[1],u*.42,u*.17,0,0,7);c.fill()}
  const d=e.dir8===undefined?2:e.dir8,sit=e.sit&&!e.walk,ch=I.char;ch.rotation.y=(2-d)*Math.PI/4;
  ch.position.y=sit?-.28:(e.walk?Math.abs(Math.sin(t/120))*.04:Math.sin(t/520)*.01);ch.rotation.z=e.walk?Math.sin(t/120)*.04:0;
  if(I.aura){const q=1+.06*Math.sin(t/380);I.aura.scale.set(2.2*q,2.2*q,1);I.aura.material.opacity=(.75+.2*Math.sin(t/500))*P.glow}
  if(I.auraG)I.auraG.userData.tick(t);
  (I.flap||[]).forEach(g=>{if(g.wing){g.wing.rotation.y=g.s*(-.2-Math.sin(t/230)*.16);g.wing.rotation.z=g.s*(-.08+Math.sin(t/230)*.05);return}if(g.halo){g.halo.rotation.z=t/900;return}const f=Math.sin(t/230);g.scale.set(1+.08*f,1+.03*f,1)});
  if(I.obj)I.obj.rotation.y=Math.max(-1.3,Math.min(1.3,-ch.rotation.y));
  const objs=I.objs||[],sizeFor=Q=>[Math.max(64,Math.round(3.2*u*Q)),Math.max(64,Math.round(3.05*u*Q))],
    pass=Q=>{const[W,Hh]=sizeFor(Q);if(SL3.w!==W||SL3.h!==Hh){SL3.r.setSize(W,Hh,false);SL3.w=W;SL3.h=Hh}SL3.r.render(I.scene,SL3.cam);c.save();c.imageSmoothingEnabled=false;c.drawImage(SL3.r.domElement,0,0,W,Hh,p[0]-1.6*u,p[1]-2.79*u,3.2*u,3.05*u);c.restore()},
    vis=ch.children.map(o=>o.visible),back=d===5||d===6||d===7,body=()=>{objs.forEach(o=>o.visible=false);pass(SL3.Q);ch.children.forEach((o,i)=>o.visible=vis[i])},
    obj=()=>{if(!objs.length)return;ch.children.forEach(o=>o.visible=objs.indexOf(o)>=0);pass(SL3.QO);ch.children.forEach((o,i)=>o.visible=vis[i])};
  if(back){obj();body()}else{body();obj()}
  return p[1]-u*(1.6+(av.hat>0||av.hac>0?.2:0))}};
})();
