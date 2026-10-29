import sys, re
import xml.etree.ElementTree as ET
p = sys.argv[1]
tree = ET.parse(p)
root = tree.getroot()
out = []
def walk(el, depth=0):
    tag = el.tag.split('}')[-1]
    if tag in ('title',):
        t = ''.join(el.itertext()).strip()
        if t: out.append('\n## ' + t)
        return
    if tag in ('p','caption','td','th','label'):
        t = ' '.join(''.join(el.itertext()).split())
        if t: out.append(t)
        return
    for c in el:
        walk(c, depth+1)
    if tag == 'tr':
        out.append('|')
walk(root)
print('\n'.join(out))
