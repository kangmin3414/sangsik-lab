import json,sys
H="const D=(p)=>{let r=null;const w=(n,d)=>{if(d>45||r)return;for(const el of n.querySelectorAll('*')){if(p(el)){r=el;return;}if(el.shadowRoot)w(el.shadowRoot,d+1);}};w(document,0);return r;};const S=ms=>new Promise(r=>setTimeout(r,ms));const FI=(root)=>{let r=null;const w=(n)=>{for(const el of n.querySelectorAll('*')){if(r)return;if(el.tagName==='INPUT'){r=el;return;}if(el.shadowRoot)w(el.shadowRoot);}};w(root);return r;};const BT=(x)=>D(el=>el.tagName==='YTCP-BUTTON'&&el.offsetParent&&(el.innerText||'').trim()===x);"
def prep_date(vid):
    return H+"let b=null;for(let i=0;i<40;i++){b=D(el=>el.getAttribute&&el.getAttribute('aria-label')==='동영상 공개 상태 수정');if(b&&b.offsetParent&&location.href.includes('%s'))break;await S(500);}if(!location.href.includes('%s'))throw new Error('wrong page');b.click();await S(1500);const t=D(el=>el.id==='datepicker-trigger');if(!t)throw new Error('no datepicker');t.click();await S(800);const di=FI(D(el=>el.tagName==='YTCP-DATE-PICKER'));di.focus();di.select();'date was '+di.value"%(vid,vid)
PREP_TIME=H+"const ti=FI(D(el=>el.id==='time-of-day-container'));ti.focus();ti.select();'time was '+ti.value"
def finish(vid,date,time):
    return H+"const want='%s %s';const set=D(el=>el.id==='datepicker-trigger').innerText.trim()+' '+FI(D(el=>el.id==='time-of-day-container')).value;if(set!==want)throw new Error('set mismatch '+set);BT('완료').click();await S(1200);const sv=D(el=>el.id==='save'&&el.tagName==='YTCP-BUTTON');sv.click();for(let i=0;i<20;i++){await S(500);if(sv.hasAttribute('disabled'))break;}const b=D(el=>el.getAttribute&&el.getAttribute('aria-label')==='동영상 공개 상태 수정');b.click();await S(1500);const back=D(el=>el.id==='datepicker-trigger').innerText.trim()+' '+FI(D(el=>el.id==='time-of-day-container')).value;BT('완료').click();(back===want&&sv.hasAttribute('disabled')?'OK ':'CHECK ')+'%s '+back"%(date,time,vid)
def tstr(hhmm):
    h,m=map(int,hhmm.split(':'))
    ap='오전' if h<12 else '오후'; h12=h if 1<=h<=12 else (h-12 if h>12 else 12)
    return f'{ap} {h12}:{m:02d}'
def batch(vid,mmdd_hhmm,tab=1542696814):
    md,hm=mmdd_hhmm.split(' '); m,d=md.split('/')
    date=f'2026. {int(m)}. {int(d)}.'; time=tstr(hm)
    return [{"name":"navigate","input":{"url":f"https://studio.youtube.com/video/{vid}/edit","tabId":tab}},
     {"name":"javascript_tool","input":{"action":"javascript_exec","tabId":tab,"text":prep_date(vid)}},
     {"name":"computer","input":{"action":"type","text":date,"tabId":tab,"action_summary":"Types the new publish date"}},
     {"name":"computer","input":{"action":"key","text":"Return","tabId":tab,"action_summary":"Confirms the date"}},
     {"name":"computer","input":{"action":"wait","duration":1,"tabId":tab}},
     {"name":"javascript_tool","input":{"action":"javascript_exec","tabId":tab,"text":PREP_TIME}},
     {"name":"computer","input":{"action":"type","text":time,"tabId":tab,"action_summary":"Types the new publish time"}},
     {"name":"computer","input":{"action":"key","text":"Return","tabId":tab,"action_summary":"Confirms the time"}},
     {"name":"computer","input":{"action":"wait","duration":1,"tabId":tab}},
     {"name":"javascript_tool","input":{"action":"javascript_exec","tabId":tab,"text":finish(vid,date,time)}}]
if __name__=='__main__':
    out=[]
    for a in sys.argv[1:]:
        vid,when=a.split('=')
        out+=batch(vid,when)
    print(json.dumps(out,ensure_ascii=False))
