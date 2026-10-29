import json,sys
s=json.load(open('shorts_repl7.json')); k,new,src=sys.argv[1:4]
s[k]['prev_new']=s[k]['new']; s[k]['new']=new; s[k]['video']=src; s[k]['prev_private']=False
json.dump(s,open('shorts_repl7.json','w'),ensure_ascii=False,indent=1); print(k,new)
