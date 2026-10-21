"""Génère les audios (voix Denise, comme le vocabulaire et la prononciation) des exemples des fiches de grammaire
   et les ajoute à audio-fr/map.js. Usage : python gen-gram-audio.py [url-api]   (par défaut : API en ligne)"""
import asyncio, json, hashlib, os, re, sys, urllib.request
import edge_tts
API = sys.argv[1] if len(sys.argv) > 1 else "https://chinois.45-192-198-98.sslip.io/api.php?gram=list&app=fr"
VOICE = 'fr-FR-DeniseNeural'
sheets = json.load(urllib.request.urlopen(API))["sheets"]
texts = []
for s in sheets:
    for e in s.get("ex") or []:
        texts.append(e[0])
    for b in s.get("blocks") or []:
        if b.get("t") == "ex":
            texts.append((b.get("tx") or b.get("fr") or "").split("\n")[0])
texts = [t.strip() for t in dict.fromkeys(texts) if t and t.strip()]
mp = open('audio-fr/map.js', encoding='utf8').read()
amap = json.loads(re.search(r'window\.AMAP=(\{.*\});?\s*$', mp, re.S).group(1))
async def one(t, sem):
    h = hashlib.md5(t.encode('utf8')).hexdigest()[:10] + '.mp3'
    p = os.path.join('audio-fr', h)
    amap[t] = h
    if os.path.exists(p): return
    async with sem:
        for _ in range(3):
            try:
                await edge_tts.Communicate(t, VOICE, rate='-10%').save(p); return
            except Exception:
                await asyncio.sleep(1)
async def main():
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*[one(t, sem) for t in texts])
    open('audio-fr/map.js', 'w', encoding='utf8').write('window.AMAP=' + json.dumps(amap, ensure_ascii=False) + ';')
    print(len(texts), 'exemples de grammaire ->', len(amap), 'audios au total')
asyncio.run(main())
