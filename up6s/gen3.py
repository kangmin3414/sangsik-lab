import json, sys, os
TAB=1542696814
m=json.load(open('/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/up6s/meta_s4.json'))
name=sys.argv[1]; x=m[name]
c=lambda a,**k: {"name":"computer","input":dict(action=a,tabId=TAB,**k)}
j=lambda t: {"name":"javascript_tool","input":{"action":"javascript_exec","tabId":TAB,"text":t}}
fu=lambda ps: {"name":"file_upload","input":{"paths":ps,"ref":"ref_220","tabId":TAB}}
b1=[{"name":"navigate","input":{"url":"https://studio.youtube.com/channel/UCSNT-TsvhptVyD63_3yn2yg/videos/upload?d=ud","tabId":TAB}},
 c('wait',duration=3),
 j("(0,eval)(localStorage.__h);(0,eval)(localStorage.__up);(0,eval)(localStorage.__us);(0,eval)(localStorage.__us2);(0,eval)(localStorage.__us3);UP_INIT()"),
 {"name":"find","input":{"query":"file input labelled partin","tabId":TAB}}, fu([x['parts'][0]])]
rest=x['parts'][1:]+[x['thumb']]
assert sum(os.path.getsize(p) for p in rest)<10_000_000
b2=[fu(rest), j(f"await US_ASM('{name}')"), j(f"await US_FILL('{name}')"),
 c('left_click',coordinate=[480,176],action_summary='Clicks the dialog heading to dismiss the hashtag suggestions'),
 j(f"await US_THUMB('{name}')"),
 j("await UP_NEXT();await UP_NEXT();await UP_NEXT();await UP_SCHED_OPEN()"),
 c('key',text='ctrl+a',action_summary='Selects the date text'), c('type',text=x['date'],action_summary='Types the publish date'),
 j(f"CK('{x['date']}')"), c('key',text='Return',action_summary='Confirms the date'), c('wait',duration=1),
 j("PT()"), c('key',text='ctrl+a',action_summary='Selects the time text'), c('type',text=x['time'],action_summary='Types the publish time'),
 c('key',text='Return',action_summary='Confirms the time'), c('wait',duration=1),
 j(f"await US_DONE('{x['date']} {x['time']}')")]
print(json.dumps(b1,ensure_ascii=False,separators=(',',':')))
print(json.dumps(b2,ensure_ascii=False,separators=(',',':')))
