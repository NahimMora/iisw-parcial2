#!/usr/bin/env bash
# Uso: bash scripts/render.sh <composicion> <nombre-archivo-sin-ext> [frame-poster]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMP="$1"; NAME="$2"; POSTER="${3:-150}"
cd "$ROOT/video"
npx remotion render src/index.ts "$COMP" "out/$NAME.raw.mp4" --codec=h264 --crf=26 --concurrency=10 --log=error
ffmpeg -v error -y -i "out/$NAME.raw.mp4" -c copy -movflags +faststart "$ROOT/public/videos/$NAME.mp4"
ffmpeg -v error -y -ss "$(python -c "print($POSTER/30)")" -i "$ROOT/public/videos/$NAME.mp4" -frames:v 1 -q:v 4 "$ROOT/public/videos/$NAME.jpg"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height -of compact "$ROOT/public/videos/$NAME.mp4"
