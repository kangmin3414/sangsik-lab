"""replfn.py FILE NEWCODE.js — replace each top-level `function NAME(` block in FILE with the same-named block from NEWCODE;
blocks in NEWCODE whose name is not in FILE are inserted before the marker line `/* ---------- HUD` (or appended)."""
import re, sys
src = open(sys.argv[1]).read(); new = open(sys.argv[2]).read()
def blocks(s):
    out = {}
    for m in re.finditer(r'^(?:// [^\n]*\n)*function (\w+)\(', s, re.M):
        end = s.index('\n}\n', m.start()) + 3
        out[m.group(1)] = (m.start(), end)
    return out
nb = blocks(new); add = []
for name, (a, b) in nb.items():
    code = new[a:b]; sb = blocks(src)
    if name in sb:
        x, y = sb[name]
        # keep the original leading comment lines of src if new has none
        src = src[:x] + code + src[y:]; print('replaced', name)
    else: add.append(code); print('added', name)
if add:
    k = src.find('/* ---------- HUD')
    ins = '\n'.join(add) + '\n'
    src = src[:k] + ins + src[k:] if k >= 0 else src + ins
open(sys.argv[1], 'w').write(src)
