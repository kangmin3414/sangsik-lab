import json, sys
TAB=1542696814
m=json.load(open('/tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad/up6s/meta_s4.json'))
name=sys.argv[1]; x=m[name]
c=lambda a,**k: {"name":"computer","input":dict(action=a,tabId=TAB,**k)}
j=lambda t: {"name":"javascript_tool","input":{"action":"javascript_exec","tabId":TAB,"text":t}}
acts=[j(f"await US_ASM('{name}')"), j(f"await US_FILL('{name}')"),
 c('left_click',coordinate=[480,176],action_summary='Clicks the dialog heading to dismiss the hashtag suggestions'),
 j(f"await US_THUMB('{name}')"),
 j("await UP_NEXT();await UP_NEXT();await UP_NEXT();await UP_SCHED_OPEN()"),
 c('key',text='ctrl+a',action_summary='Selects the date text'), c('type',text=x['date'],action_summary='Types the publish date'),
 j(f"CK('{x['date']}')"), c('key',text='Return',action_summary='Confirms the date'), c('wait',duration=1),
 j("PT()"), c('key',text='ctrl+a',action_summary='Selects the time text'), c('type',text=x['time'],action_summary='Types the publish time'),
 c('key',text='Return',action_summary='Confirms the time'), c('wait',duration=1),
 j(f"await US_DONE('{x['date']} {x['time']}')")]
print(json.dumps(acts,ensure_ascii=False,separators=(',',':')))
print(json.dumps(x['parts']+[x['file']] if not x['parts'] else x['parts'],ensure_ascii=False), x['thumb'])
