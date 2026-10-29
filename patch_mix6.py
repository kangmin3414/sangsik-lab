import sys
p = sys.argv[1]; s = open(p).read()
lines = s.split('\n')
a = [i for i, l in enumerate(lines) if l.startswith('# ---- calm background music')][0]
b = [i for i, l in enumerate(lines) if l.startswith('# ---- sound effects tied')][0]
new = open(sys.argv[2]).read()
anchor = '    if sc == "thanks":\n        for k, f in enumerate'
assert s.count(anchor) == 1
sfx = open(sys.argv[3]).read()
s = s.replace(anchor, sfx + anchor)
lines = s.split('\n')
a = [i for i, l in enumerate(lines) if l.startswith('# ---- calm background music')][0]
b = [i for i, l in enumerate(lines) if l.startswith('# ---- sound effects tied')][0]
lines = lines[:a] + new.rstrip('\n').split('\n') + lines[b:]
open(p, 'w').write('\n'.join(lines)); print('patched')
