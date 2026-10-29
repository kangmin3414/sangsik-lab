// Studio video details page (studio.youtube.com/video/<id>/edit): rewrite title + description with the rename rules.
// Draft for the live session — run with top-level await in the page, then save with the page's 저장 button and verify.
window.__deep = (pred) => { let r = null; const w = (root, d) => { if (d > 45 || r) return; for (const el of root.querySelectorAll('*')) { if (pred(el)) { r = el; return; } if (el.shadowRoot) w(el.shadowRoot, d + 1); } }; w(document, 0); return r; };
const RULES = [
  ['https://www.youtube.com/@만약에연구소Whatif?sub_confirmation=1', 'https://www.youtube.com/channel/UCSNT-TsvhptVyD63_3yn2yg?sub_confirmation=1'],
  ['#만약에연구소', '#상식실험실'],
  ['#만약에', '#상식실험실'],
  ['만약에연구소', '상식실험실'],
];
const ren = (s) => RULES.reduce((a, [x, y]) => a.split(x).join(y), s);
const box = (start) => window.__deep(el => el.id === 'textbox' && el.getAttribute('contenteditable') && (el.getAttribute('aria-label') || '').startsWith(start));
await new Promise(r => setTimeout(r, 2500));
const out = {};
for (const [k, start] of [['title', '동영상을 설명하는 제목'], ['desc', '시청자에게']]) {
  const el = box(start);
  if (!el) { out[k] = 'missing'; continue; }
  const cur = el.innerText.replace(/\n$/, ''); const nw = ren(cur);
  if (nw === cur) { out[k] = 'same'; continue; }
  el.focus(); document.execCommand('selectAll', false, null); document.execCommand('insertText', false, nw);
  await new Promise(r => setTimeout(r, 400));
  out[k] = el.innerText.replace(/\n$/, '') === nw ? 'changed' : 'MISMATCH';
}
JSON.stringify(out)
