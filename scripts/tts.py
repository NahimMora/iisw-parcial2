"""Genera la narración de cada video con edge-tts (voz es-AR) y escribe timing.json.

Uso: python scripts/tts.py <video-id> [<video-id> ...]
Lee  video/src/videos/<id>/script.json  {"voice":..., "rate":..., "beats":[{"id","text"}]}
Escribe video/public/audio/<id>/<beat>.mp3 y video/src/videos/<id>/timing.json
Cachea por hash del texto: solo regenera lo que cambió.
"""
import asyncio, hashlib, json, subprocess, sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent / 'video'
FPS = 30
GAP = 0.45  # silencio entre beats (s)


def duration(p: Path) -> float:
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)],
                         capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


async def synth(text: str, voice: str, rate: str, out: Path, sem: asyncio.Semaphore):
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text, voice, rate=rate).save(str(out))
                return
            except Exception as e:  # red inestable: reintento
                if attempt == 3:
                    raise
                await asyncio.sleep(2 + attempt * 2)


async def run(vid: str):
    sdir = ROOT / 'src' / 'videos' / vid
    script = json.loads((sdir / 'script.json').read_text(encoding='utf-8'))
    voice = script.get('voice', 'es-AR-TomasNeural')
    rate = script.get('rate', '+6%')
    adir = ROOT / 'public' / 'audio' / vid
    adir.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(4)
    jobs = []
    for b in script['beats']:
        h = hashlib.sha1(f"{voice}|{rate}|{b['text']}".encode()).hexdigest()[:10]
        b['file'] = f"{b['id']}-{h}.mp3"
        target = adir / b['file']
        if not target.exists():
            jobs.append(synth(b['text'], voice, rate, target, sem))
    await asyncio.gather(*jobs)
    # limpiar audios viejos
    keep = {b['file'] for b in script['beats']}
    for f in adir.glob('*.mp3'):
        if f.name not in keep:
            f.unlink()
    t = 0.6
    beats = []
    for b in script['beats']:
        d = duration(adir / b['file'])
        hold = float(b.get('hold', 0))
        beats.append({'id': b['id'], 'file': b['file'], 'start': round(t * FPS), 'dur': round((d + GAP + hold) * FPS), 'audio': round(d * FPS), 'text': b['text']})
        t += d + GAP + hold
    total = round((t + 1.5) * FPS)
    (sdir / 'timing.json').write_text(json.dumps({'fps': FPS, 'total': total, 'beats': beats}, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f"{vid}: {len(beats)} beats, {t/60:.1f} min ({len(jobs)} audios nuevos)")


if __name__ == '__main__':
    for v in sys.argv[1:]:
        asyncio.run(run(v))
