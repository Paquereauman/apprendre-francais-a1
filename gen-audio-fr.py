import asyncio, json, hashlib, os, re, subprocess
import edge_tts
src = open('data-fr.js', encoding='utf8').read()
js = src + "\nconsole.log(JSON.stringify([...new Set([...CATS.flatMap(c=>c.items.map(i=>i[0])),...PH.map(p=>p[0].split('/').join(' '))])]));"
open('_t.js','w',encoding='utf8').write(js)
texts = json.loads(subprocess.check_output(['node','_t.js']).decode('utf8'))
os.remove('_t.js')
VOICE = 'fr-FR-DeniseNeural'
amap = {}
async def one(t, sem):
    h = hashlib.md5(t.encode('utf8')).hexdigest()[:10] + '.mp3'
    amap[t] = h
    p = os.path.join('audio-fr', h)
    if os.path.exists(p): return
    async with sem:
        for _ in range(3):
            try:
                await edge_tts.Communicate(t, VOICE, rate='-10%').save(p); return
            except Exception as e:
                await asyncio.sleep(1)
async def main():
    sem = asyncio.Semaphore(6)
    await asyncio.gather(*[one(t, sem) for t in texts])
    open('audio-fr/map.js','w',encoding='utf8').write('window.AMAP='+json.dumps(amap,ensure_ascii=False)+';')
    print(len(texts), 'textes')
asyncio.run(main())
