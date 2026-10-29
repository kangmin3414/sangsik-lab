set -e
cd walk && rm -rf frames && (python3 render3.py 0 3300 > r1.log 2>&1 & python3 render3.py 3300 7000 > r2.log 2>&1 & wait) && cd ..
ffmpeg -v error -y -framerate 24 -i walk/frames/f%05d.jpg -i walk/mix.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "walk/만약에연구소_실험002_매일30분걷는다면_v2.mp4"
echo WALK_DONE
cd shorts && rm -rf frames2 && python3 render_all2.py > r.log 2>&1 && cd ..
ffmpeg -v error -y -framerate 30 -i shorts/frames2/f%05d.jpg -i shorts/audio.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "shorts/만약에연구소_쇼츠_중력1-6_v3.mp4"
echo SHORTS_DONE
