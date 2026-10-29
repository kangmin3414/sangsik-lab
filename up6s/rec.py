import json, sys
p=json.load(open('progress.json')); p[sys.argv[1]]={'id':sys.argv[2]}
json.dump(p,open('progress.json','w'),ensure_ascii=False,indent=1); print(len(p),'done')
