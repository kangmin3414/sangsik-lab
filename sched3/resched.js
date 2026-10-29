const __deep = (pred) => { let r = null; const w = (root, d) => { if (d > 45 || r) return; for (const el of root.querySelectorAll('*')) { if (pred(el)) { r = el; return; } if (el.shadowRoot) w(el.shadowRoot, d + 1); } }; w(document, 0); return r; };
const __sleep = ms => new Promise(r=>setTimeout(r,ms));
const __firstInput = (root) => { let r=null; const w=(n)=>{for(const el of n.querySelectorAll('*')){ if(r) return; if(el.tagName==='INPUT'){r=el;return;} if(el.shadowRoot) w(el.shadowRoot);} }; w(root); return r; };
const __btn = (txt) => __deep(el => el.tagName==='YTCP-BUTTON' && el.offsetParent && (el.innerText||'').trim()===txt);
async function RESCHED(id, dateStr, timeStr) {
  for (let i=0;i<20 && !location.href.includes(id);i++) await __sleep(300);
  let b=null; for (let i=0;i<30;i++){ b = __deep(el => el.getAttribute && el.getAttribute('aria-label') === '동영상 공개 상태 수정'); if (b && b.offsetParent) break; await __sleep(500); }
  if (!location.href.includes(id)) throw new Error('wrong page');
  b.click(); await __sleep(1500);
  const trig = __deep(el => el.id === 'datepicker-trigger'); if (!trig) throw new Error('no datepicker');
  if (trig.innerText.trim() !== dateStr) {
    trig.click(); await __sleep(800);
    const di = __firstInput(__deep(el => el.tagName==='YTCP-DATE-PICKER'));
    di.focus(); di.select(); document.execCommand('insertText', false, dateStr);
    di.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
    await __sleep(800);
  }
  const ti = __firstInput(__deep(el => el.id === 'time-of-day-container'));
  if (ti.value !== timeStr) {
    ti.focus(); ti.select(); document.execCommand('insertText', false, timeStr);
    ti.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));
    await __sleep(800);
  }
  const set = trig.innerText.trim() + ' ' + ti.value;
  if (set !== dateStr + ' ' + timeStr) throw new Error('set mismatch: ' + set);
  const done = __btn('완료'); done.click(); await __sleep(1200);
  const save = __deep(el => el.id==='save' && el.tagName==='YTCP-BUTTON');
  if (!save || save.hasAttribute('disabled')) return 'no change needed: ' + set;
  save.click();
  for (let i=0;i<20;i++){ await __sleep(500); if (save.hasAttribute('disabled')) break; }
  // read back
  b.click(); await __sleep(1500);
  const t2 = __deep(el => el.id === 'datepicker-trigger'); const ti2 = __firstInput(__deep(el => el.id === 'time-of-day-container'));
  const back = t2.innerText.trim() + ' ' + ti2.value;
  const done2 = __btn('완료'); if (done2) done2.click();
  return (back === dateStr + ' ' + timeStr ? 'OK ' : 'MISMATCH ') + id + ' ' + back + ' saved=' + save.hasAttribute('disabled');
}
