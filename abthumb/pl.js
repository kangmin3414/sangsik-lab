async function __pl(want){
  for(let i=0;i<40 && !document.querySelector('ytcp-video-metadata-playlists');i++) await new Promise(r=>setTimeout(r,500));
  await new Promise(r=>setTimeout(r,800));
  const trig=document.querySelector('ytcp-video-metadata-playlists ytcp-dropdown-trigger')||document.querySelector('ytcp-video-metadata-playlists [role=button]');
  const find=()=>[...document.querySelectorAll('tp-yt-paper-dialog')].find(d=>d.innerText.includes('새 재생목록')&&[...d.querySelectorAll('ytcp-checkbox-lit')].some(c=>c.parentElement.innerText.includes('제로의 실험 전체')));
  let pd=find(); if(!pd) trig.click();
  for(let i=0;i<30 && !pd;i++){ await new Promise(r=>setTimeout(r,300)); pd=find(); }
  if(!pd) return 'no picker';
  const rows=[...pd.querySelectorAll('ytcp-checkbox-lit')];
  const lab=c=>c.parentElement.innerText.trim();
  const chk=c=>(c.querySelector('[role=checkbox]')||c).getAttribute('aria-checked')==='true';
  for(const w of want){ const c=rows.find(r=>lab(r).startsWith(w)); if(c && !chk(c)) (c.querySelector('[role=checkbox]')||c).click(); await new Promise(r=>setTimeout(r,250)); }
  const state=rows.filter(chk).map(lab);
  const done=[...pd.querySelectorAll('ytcp-button, button')].find(b=>b.innerText.trim()==='완료'); if(done) done.click();
  await new Promise(r=>setTimeout(r,600));
  return {checked:state, saveEnabled:!document.querySelector('#save').hasAttribute('disabled')};
}
