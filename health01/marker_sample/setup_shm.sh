#!/bin/bash
# /dev/shm가 비워졌을 때 작업 공간을 되살린다: 폴더, 글꼴(npm), 페이지, 저장소 링크, 로컬 서버, 테이크(takes_opus → wav).
set -e
HERE=$(cd "$(dirname "$0")" && pwd); OP=/dev/shm/op
mkdir -p $OP/web $OP/tmp $OP/npmcache $OP/ms_takes2
cd $OP/web
[ -d node_modules/@fontsource/gaegu ] || { echo '{"name":"w","version":"1.0.0"}' > package.json; npm install --silent --cache $OP/npmcache @fontsource/gaegu >/dev/null 2>&1; }
cp "$HERE/web/ms.html" $OP/web/ms.html
ln -sfn /home/claude/sangsik-lab $OP/web/repo
pgrep -f "http.server 8765" >/dev/null || (nohup python3 -m http.server 8765 --bind 127.0.0.1 > $OP/http.log 2>&1 &)
for f in "$HERE"/takes_opus/*.opus; do w=$OP/ms_takes2/$(basename "${f%.opus}").wav; [ -f "$w" ] || ffmpeg -nostdin -y -loglevel error -i "$f" -ar 24000 -ac 1 "$w"; done
echo "ok: $(ls $OP/ms_takes2 | wc -l) takes"
