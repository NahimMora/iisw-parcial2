# Estado del proyecto (registro de ejecución)

> Archivo para retomar el trabajo tras una interrupción. Se actualiza en cada entrega.

- **Fase actual:** producción progresiva de capítulos.
- **URL desplegada:** https://nahimmora.github.io/iisw-parcial2/
- **Repositorio:** https://github.com/NahimMora/iisw-parcial2

## Estructura

| Carpeta | Contenido |
|---|---|
| `../private/` (fuera del repo) | materiales originales, texto extraído, frames, auditoría, roadmap PDF |
| `src/content/` | contenido estructurado por capítulo (`chapters/chN.ts`), casos de referencia, registro |
| `src/components/` | diagramas UML SVG, preguntas, mapa conceptual, teoría |
| `src/lib/` | corrección determinista, persistencia (localStorage + JSON), dominio y repaso adaptativo |
| `src/pages/` | panel, capítulo (9 secciones), repaso, progreso, entrenador, simulacros |
| `video/` | proyecto Remotion: `src/engine` (motor), `src/videos/chN/` (guion `script.json`, `timing.json`, composición) |
| `scripts/` | `tts.py` (narración edge-tts es-AR + tiempos), `render.sh`, `html2pdf.mjs` |
| `public/videos/` | MP4 publicados (H.264, faststart) y pósters |
| `tests/` | unit (vitest) y e2e (Playwright) |

## Agregar un capítulo
1. `src/content/chapters/chN.ts` con `status: 'ready'` y agregarlo a `ready` en `registry.ts`.
2. Guion en `video/src/videos/chN/script.json` → `python scripts/tts.py chN` → composición `ChN.tsx` → registrar en `video/src/Root.tsx`.
3. `bash scripts/render.sh <composicion> <archivo>`; QC; `npm run typecheck && npm test && npm run build && npm run e2e`; commit y push.

## Capítulos

| Cap. | Estado | Video | Notas |
|---|---|---|---|
| 1 Requerimientos y casos de uso | publicado | ch1-casos-de-uso.mp4 (5:57) | |
| 2 Descripción de CU | publicado | ch2-descripcion-cu.mp4 (4:23) | |
| 3 Diagrama de secuencia | contenido escrito, video pendiente | — | |
| 4 Prototipos e HU | pendiente | — | |
| 5 Pruebas | pendiente | — | |
| 6 Tipos de sistemas | pendiente | — | |
| 7 Reingeniería y formales | pendiente | — | |
| Entrenador | pendiente | — | |
| Simulacros | pendiente | — | |

## Problemas detectados / decisiones
- Figuras UML del PDF de teoría son imágenes: se reconstruyeron desde el texto y la clase grabada.
- Narración: edge-tts (voz es-AR-TomasNeural), gratuito, sin clave.
- Progreso solo local (GitHub Pages no sincroniza); exportar/importar JSON.
