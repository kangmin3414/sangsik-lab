#!/usr/bin/env python3
"""한국어 AI 말투 후보를 줄 번호와 함께 찾는다(고치지 않는다).

사용법:
  python3 ko_slop_check.py 파일.md [파일2 ...]
  python3 ko_slop_check.py --script 대본_v1.md   # 제로의 세계 대본: 읽는 줄만 검사
  python3 ko_slop_check.py --tts 읽을문장.txt     # TTS로 읽을 글: 숫자·기호도 경고
  python3 ko_slop_check.py --json 파일.md

결과는 '후보'다. 문맥을 보고 사람이(또는 ko-deslop 스킬이) 판단한다.
종료 코드: 강한 패턴(§1~5, §8, §19~21)이 있으면 1, 아니면 0.
"""
import argparse
import json
import re
import sys

# (번호, 이름, 강함 여부, 정규식)
PATTERNS = [
    (1, "A가 아니라 B", True, r"(단순(한|히)\s*\S+(이|가)\s*아니라|\S(이|가)\s*아니라[,\s]|라기보다(는)?|뿐만\s*아니라|를\s*넘어\s*\S+(으)?로|인\s*줄\s*알았지만\s*사실|는\s*\S+(이|가)\s*아니다\.)"),
    (2, "한 줄 마무리·해설", True, r"(그게\s*전부였|그거면\s*충분했|이것이\s*바로|그것이\s*바로|모든\s*것이\s*(바뀌|달라)|메시지는\s*분명|보여\s*준다\.|보여\s*줍니다\.)"),
    (3, "깊어 보이는 말", True, r"(결국\s*중요한\s*(건|것은)|본질은|핵심은|어쩌면\s*우리는|라는\s*이름의|우리\s*모두는)"),
    (4, "뜸 들이기", True, r"(자,?\s*그럼|알아보(겠|도록\s*하겠)습니다|중요한\s*포인트|궁금하시죠|결론부터\s*말씀|놀라운\s*사실은|솔직히\s*말(하면|해서))"),
    (5, "아무도 안 한 반론", True, r"(생각할\s*수도\s*있(습니다|겠지만)|오해하지\s*마세요|라는\s*뜻은\s*아닙니다|누군가는\s*\S+\s*말할지도)"),
    (8, "줄표", True, r"(—|–|\s--\s)"),
    (9, "겹겹 얼버무림", False, r"(수도\s*있을\s*것\s*같|볼\s*수\s*있을\s*것|어느\s*정도|다소|일정\s*부분)"),
    (10, "번역투", False, r"(하는\s*것이\s*중요|할\s*필요가\s*있|에\s*있어서|을\s*통해|를\s*통해|시간을\s*가지|의미를\s*가지|되어지|로\s*인해|에\s*의해|하는\s*중에\s*있|할\s*수\s*있게\s*되었|하나의\s*방법|가장\s*\S+\s*것\s*중\s*하나)"),
    (11, "사물 주어", False, r"(변화가\s*찾아|질문이\s*생겨|데이터가\s*말|결정이\s*내려|마음이\s*움직)"),
    (12, "AI 단골 어휘", False, r"(여정|선사하|깊은\s*울림|진정한|다채로운|풍부한|핵심적인|한\s*걸음\s*더|새로운\s*장|녹아들|어우러지|오롯이|아로새기|스며들|피어나|마법\s*같은)"),
    (13, "의미 부풀리기", False, r"(의\s*시작이었|큰\s*영향을\s*미쳤|중요한\s*역할|새로운\s*시대를|앞으로가\s*더\s*기대|그럼에도\s*불구하고)"),
    (14, "모호한 연결", False, r"(와\s*관련이\s*있|과\s*관련이\s*있|와\s*연결되어\s*있|과\s*연결되어\s*있|와\s*무관하지\s*않|과\s*무관하지\s*않)"),
    (15, "광고 말투", False, r"(놓치지\s*마세요|완벽한|의\s*정석|역대급|단언컨대|꿀팁)"),
    (16, "빌려 온 권위", False, r"(전문가들은|연구에\s*따르면|많은\s*사람들이|흔히들)"),
    (17, "이다/있다 피하기", False, r"(역할을\s*(하|한)|로\s*작용|를\s*제공하|을\s*제공하|를\s*자랑하|로\s*자리매김)"),
    (19, "챗봇 인사", True, r"(도움이\s*되셨|좋은\s*질문|물론이죠|더\s*궁금한\s*점|정리해\s*드리면)"),
    (20, "모름 뒤 추측", True, r"(알려지지\s*않았지만|확인되지\s*않았지만)"),
    (21, "글이 자기 설명", True, r"(이번\s*영상에서는|아래\s*표는|이\s*글에서는)"),
    (22, "속마음 설명 대사", False, r"(사실\s*나도|나는\s*지금\s*\S+\s*기분)"),
    (24, "감정 형용사 직접", False, r"(먹먹해|뭉클했|슬펐다|가슴이\s*(아팠|따뜻해))"),
]
COMPILED = [(n, name, strong, re.compile(rx)) for n, name, strong, rx in PATTERNS]

SCRIPT_LINE = re.compile(r"^\s*(\d+)\.\s*\*\*([^*]+)\*\*\s*(.*)$")
ENDING = re.compile(r"(습니다|니다|죠|어요|아요|에요|예요|해요|다)[.!?…]*\s*$")


def spoken_lines(text, script_mode):
    """(줄 번호, 검사할 글) 목록. 대본 모드는 '번호. **화자** 말' 줄만."""
    out, in_code, in_front = [], False, False
    for i, line in enumerate(text.splitlines(), 1):
        s = line.strip()
        if i == 1 and s == "---":
            in_front = True
            continue
        if in_front:
            if s == "---":
                in_front = False
            continue
        if s.startswith("```"):
            in_code = not in_code
            continue
        if in_code or not s:
            continue
        if script_mode:
            m = SCRIPT_LINE.match(line)
            if not m:
                continue
            body = m.group(3).strip().strip('"“”')
            out.append((i, body))
        else:
            out.append((i, line))
    return out


def sentence_endings(lines):
    """같은 어미로 끝나는 문장이 3번 넘게 이어지는 곳(§7)."""
    hits, run, last = [], [], None
    for ln, body in lines:
        for sent in re.split(r"(?<=[.!?])\s+", body):
            m = ENDING.search(sent.strip())
            end = m.group(1) if m else None
            if end and end == last:
                run.append(ln)
            else:
                if len(run) >= 3:
                    hits.append((run[0], last, len(run)))
                run = [ln] if end else []
            last = end
    if len(run) >= 3:
        hits.append((run[0], last, len(run)))
    return hits


def check(path, script_mode, tts_mode=False):
    text = open(path, encoding="utf-8").read()
    lines = spoken_lines(text, script_mode)
    findings = []
    for ln, body in lines:
        for n, name, strong, rx in COMPILED:
            for m in rx.finditer(body):
                findings.append({"line": ln, "pattern": n, "name": name, "strong": strong,
                                 "match": m.group(0), "text": body.strip()[:80]})
        if script_mode:
            for sent in re.split(r"(?<=[.!?…])\s+", body):
                plain = re.sub(r"\s", "", sent)
                if len(plain) > 45 and "," not in sent:
                    findings.append({"line": ln, "pattern": 26, "name": "숨 한 번에 읽기 긴 문장", "strong": False,
                                     "match": f"{len(plain)}자", "text": sent.strip()[:80]})
        if tts_mode and re.search(r"[0-9%→/]", body):
            findings.append({"line": ln, "pattern": 26, "name": "숫자·기호(읽을 문장은 한글로)", "strong": False,
                             "match": " ".join(re.findall(r"[0-9%→/.]+", body))[:30], "text": body.strip()[:80]})
    for ln, end, count in sentence_endings(lines):
        findings.append({"line": ln, "pattern": 7, "name": "같은 어미 반복", "strong": False,
                         "match": f"~{end} {count}번 연속", "text": ""})
    findings.sort(key=lambda f: (f["line"], f["pattern"]))
    return findings


def main():
    ap = argparse.ArgumentParser(description="한국어 AI 말투 후보 찾기")
    ap.add_argument("files", nargs="+")
    ap.add_argument("--script", action="store_true", help="제로의 세계 대본 형식: 읽는 줄만 검사")
    ap.add_argument("--tts", action="store_true", help="TTS로 읽을 문장(lines_*.py 등): 숫자·기호도 경고")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    any_strong = False
    report = {}
    for f in a.files:
        res = check(f, a.script, a.tts)
        report[f] = res
        any_strong |= any(r["strong"] for r in res)
    if a.json:
        print(json.dumps(report, ensure_ascii=False, indent=1))
    else:
        for f, res in report.items():
            strong = sum(r["strong"] for r in res)
            print(f"== {f}: 후보 {len(res)}개 (강함 {strong}개)")
            for r in res:
                mark = "강" if r["strong"] else "약"
                tail = f"  | {r['text']}" if r["text"] else ""
                print(f"  {r['line']:>4}줄 [{mark}] §{r['pattern']} {r['name']}: {r['match']}{tail}")
    sys.exit(1 if any_strong else 0)


if __name__ == "__main__":
    main()
