#!/bin/bash
# One command per week:  ./make_episode.sh <episode-id>
# Needs build/<id>/voice/sXX_LL.wav + build/<id>/voice.json (the processed narration — see TEMPLATE.md).
# Steps: timeline -> visuals -> music -> mix -> chunked render (resumable, 2 workers) -> final MP4s -> done.flag
set -e
cd "$(dirname "$0")"
EP=$1; B=build/$EP; mkdir -p $B
PY=${PY_TOOLS:-/home/user/parshaland_work/ptts/bin/python}; FF=${FFMPEG:-ffmpeg}
[ -f $B/voice.json ] || { echo "no narration yet: $B/voice.json missing"; exit 1; }
python3 plan.py $EP
python3 build.py $EP
$PY music.py $EP
$PY mix.py $EP
export FILM=$PWD/$B/film.html
DUR=$(python3 -c "import json;print(json.load(open('$B/timeline.json'))['duration'])")
FPS=24; CH=10; N=$(python3 -c "import math;print(math.ceil($DUR/$CH))"); TOTAL=$(python3 -c "print(int($DUR*$FPS))")
worker() { for ((i=$1; i<N; i+=2)); do
  [ -f $B/chunk$i.ok ] && continue
  a=$((i*CH*FPS)); b=$(( (i+1)*CH*FPS )); [ $b -gt $TOTAL ] && b=$TOTAL
  node render.mjs $a $b $B/chunk$i.mp4 > $B/chunk$i.log 2>&1 && touch $B/chunk$i.ok
done; }
worker 0 & worker 1 & wait
: > $B/segs.txt; for ((i=0; i<N; i++)); do [ -f $B/chunk$i.ok ] || { echo "chunk $i missing"; exit 1; }; echo "file 'chunk$i.mp4'" >> $B/segs.txt; done
NAME=Parshas_$(python3 -c "import json;print(json.load(open('$B/timeline.json'))['parsha'].replace(' ','_'))")
$FF -hide_banner -loglevel error -y -f concat -safe 0 -i $B/segs.txt -i $B/soundtrack.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1.2:LRA=11" -ar 44100 -c:a aac -b:a 224k -shortest -movflags +faststart $B/${NAME}_1080p.mp4
$FF -hide_banner -loglevel error -y -i $B/${NAME}_1080p.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -crf 26 -maxrate 1500k -bufsize 3000k -c:a aac -b:a 128k -movflags +faststart $B/${NAME}_720p.mp4
echo ALLDONE > $B/done.flag
