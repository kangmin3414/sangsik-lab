set -e
SP=/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad
declare -A V=( [walk]="$SP/walk/만약에연구소_실험002_매일30분걷는다면_v2.mp4" [phone]="$SP/phone/만약에연구소_실험003_일주일스마트폰끊기_v3.mp4" [sugar]="$SP/sugar/상식실험실_실험004_한달설탕끊기_v4.mp4" [nie]="$SP/nietzsche3/상식실험실_실험005_현대에서니체처럼살기_v4.mp4" [sto]="$SP/stoic3/상식실험실_실험006_스토아철학자처럼일주일_v5.mp4" [des]="$SP/descartes4/상식실험실_실험007_데카르트처럼모든걸의심하기_v7.mp4" [zhu]="$SP/zhuangzi5/상식실험실_실험008_장자처럼남의잣대내려놓기_v7.mp4" [soc]="$SP/socrates3/상식실험실_실험009_소크라테스처럼질문하며살기_v5.mp4" [bud]="$SP/buddha3/상식실험실_실험010_붓다처럼지금여기에살기_v5.mp4" [tim]="$SP/time011/상식실험실_실험011_1년이빨라진게아니었다_v2.mp4" )
for spec in "$@"; do k=${spec%%:*}; t=${spec#*:}; ffmpeg -v error -y -ss $t -i "${V[$k]}" -frames:v 1 -vf scale=480:270 $SP/trailer2/cand/${k}_${t}.jpg; done
