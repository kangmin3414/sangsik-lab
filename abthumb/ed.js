async function __run(title, prefix){
  for(let i=0;i<40 && document.querySelectorAll('#textbox').length<2;i++) await new Promise(r=>setTimeout(r,500));
  await new Promise(r=>setTimeout(r,800));
  const tb=[...document.querySelectorAll('#textbox')]; const t=tb[0], d=tb[1]; const sel=window.getSelection();
  if(title && t.innerText.trim()!==title){ t.focus(); document.execCommand('selectAll',false,null); document.execCommand('insertText',false,title); }
  if(prefix && !d.innerText.startsWith(prefix.trim())){ d.focus(); const r=document.createRange(); r.setStart(d,0); r.collapse(true); sel.removeAllRanges(); sel.addRange(r); document.execCommand('insertText',false,prefix); }
  await new Promise(r=>setTimeout(r,700));
  const s=document.querySelector('#save'); const before=s.hasAttribute('disabled');
  if(!before) s.click();
  await new Promise(r=>setTimeout(r,3000));
  return {title:t.innerText, desc:d.innerText.slice(0,60), savedNow:!before, saveDisabledAfter:s.hasAttribute('disabled')};
}
