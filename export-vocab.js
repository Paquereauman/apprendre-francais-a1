// Génère server/vocab-fr.json (utilisé par le serveur pour fabriquer et corriger les quiz de fin de chapitre).
// Usage : node export-vocab.js   (à relancer après toute modification des fichiers data-fr*.js)
const fs=require("fs"),vm=require("vm");
const src=["data-fr.js","data-fr2.js","data-fr3.js"].map(f=>fs.readFileSync(f,"utf8")).join("\n")+"\n;this.__o={CATS,STEPS,PH};";
const c={};vm.runInNewContext(src,c);const {CATS,STEPS,PH}=c.__o;
const units={};CATS.forEach(u=>{units[u.id]={name:u.name,items:u.items.map(i=>i.slice(0,5))}});
const out={steps:STEPS.map(s=>({key:s[2],title:s[0],units:s[1]})),units,phrases:PH.map(p=>[p[0],p[1],p[2]])};
fs.mkdirSync("server",{recursive:true});fs.writeFileSync("server/vocab-fr.json",JSON.stringify(out));
console.log("vocab-fr.json :",out.steps.length,"chapitres,",Object.keys(units).length,"fiches,",Object.values(units).reduce((n,u)=>n+u.items.length,0),"mots,",out.phrases.length,"phrases");
