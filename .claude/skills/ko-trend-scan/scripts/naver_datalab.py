#!/usr/bin/env python3
"""네이버 데이터랩 통합 검색어 트렌드로 키워드 검색 추세를 비교한다(선택 소스).

필요: 환경 변수 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET (네이버 개발자센터 앱, '데이터랩(검색어트렌드)' 사용 설정).
사용법: python3 naver_datalab.py [--days 30] 키워드1 키워드2 ... (최대 5개)
출력: 키워드별 최근 값, 기간 평균, 첫 주 대비 마지막 주 변화. 값은 기간 안 최댓값을 100으로 둔 상대값이다.
키가 없거나 네트워크가 막히면 이유를 한 줄로 알리고 종료 코드 2로 끝난다(트렌드 스킬은 이것을 '키 없음/막힘'으로 적는다).
키 값은 출력하지 않는다.
"""
import argparse
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.request

URL = "https://openapi.naver.com/v1/datalab/search"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("keywords", nargs="+")
    ap.add_argument("--days", type=int, default=30)
    a = ap.parse_args()
    cid, sec = os.environ.get("NAVER_CLIENT_ID"), os.environ.get("NAVER_CLIENT_SECRET")
    if not cid or not sec:
        print("상태: 키 없음 (NAVER_CLIENT_ID / NAVER_CLIENT_SECRET)")
        sys.exit(2)
    kws = a.keywords[:5]
    end = dt.date.today() - dt.timedelta(days=1)
    start = end - dt.timedelta(days=a.days - 1)
    body = {
        "startDate": start.isoformat(), "endDate": end.isoformat(), "timeUnit": "date",
        "keywordGroups": [{"groupName": k, "keywords": [k]} for k in kws],
    }
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), method="POST", headers={
        "X-Naver-Client-Id": cid, "X-Naver-Client-Secret": sec, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        print(f"상태: 오류 (HTTP {e.code})")
        sys.exit(2)
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        print(f"상태: 막힘 ({type(e).__name__})")
        sys.exit(2)
    print(f"기간 {start} ~ {end} (상대값, 최대 100)")
    for res in data.get("results", []):
        vals = [p["ratio"] for p in res.get("data", [])]
        if not vals:
            print(f"- {res['title']}: 데이터 없음")
            continue
        first, last = vals[:7], vals[-7:]
        f_avg, l_avg = sum(first) / len(first), sum(last) / len(last)
        change = (l_avg - f_avg) / f_avg * 100 if f_avg else float("inf")
        print(f"- {res['title']}: 최근 {vals[-1]:.1f} · 평균 {sum(vals)/len(vals):.1f} · 첫 주 대비 마지막 주 {change:+.0f}%")


if __name__ == "__main__":
    main()
