import json, sys
key, old, new, when = sys.argv[1:5]
p = json.load(open('progress.json'))
p[key] = {'old': old, 'new': new, 'when': when, 'thumb': 'pending (daily limit)', 'old_private': True}
if len(sys.argv) > 5: p[key]['related'] = sys.argv[5]
json.dump(p, open('progress.json', 'w'), ensure_ascii=False, indent=1); print(len(p), 'done:', ', '.join(p))
