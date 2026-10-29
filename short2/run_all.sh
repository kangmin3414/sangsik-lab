set -e
cd "$(dirname "$0")"
for n in s2_스트레스 s3_BDNF s4_아이디어 s5_치매; do
  python3 audio_s.py $n
  N=$(python3 -c "import json;c={x['name']:x for x in json.load(open('shorts.json'))}['$n'];print(int((sum(d for a,d in c['seg'])+5.44)*24))")
  H=$((N/2))
  rm -rf "fr_$n"; mkdir -p "fr_$n"
  python3 render_s.py $n run 0 $H > /dev/null 2>&1 &
  python3 render_s.py $n run $H 99999 > /dev/null 2>&1 &
  wait
  ffmpeg -v error -y -framerate 24 -i "fr_$n/f%05d.jpg" -i "au_$n.wav" -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "만약에연구소_쇼츠_$n.mp4"
  echo "done $n $(ls fr_$n | wc -l)"
done
