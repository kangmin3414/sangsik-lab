# Shared recipe for fixing a finished episode (read fully before starting)

Machine: 2 CPU cores, shared by 4 workers running at the same time. ~6 GB free disk total. So:
- Run every heavy process with `nice -n 10`, ONE render process at a time (no parallel render.py halves).
- NEVER dump the whole video to frames on disk. NEVER use broad `pkill`/`killall` (other workers run ffmpeg/chromium too) — kill only PIDs you started.
- Work only inside your own episode folder (EP below). Before editing any .js, copy it to `<name>_prefix.bak.js` (e.g. scenes8b_prefix.bak.js).

Pipeline facts:
- timeline.json gives each line i: t0, t1, scene, args, segs. Do NOT change timeline.json, voice.wav, mix*.wav or any timing — audio stays exactly as in the current final mp4.
- The anim html page (anim*.html) exposes `render(t)`; render*.py shows how frames are shot with playwright (Chromium preinstalled; `from playwright.sync_api import sync_playwright`; viewport 1920x1080; after goto, `pg.evaluate("tl => { window.TL = tl; }", tl)` then `pg.evaluate("window.AI_READY")` to wait for AI images). Frame index f ↔ time f/24.
- qa_sheet.py in the folder renders stills at a fraction of each line — useful to check fixes.

Steps:
1. Make the code fixes (scenes*.js / ai*.js). Keep changes minimal and local; don't restyle unrelated scenes.
2. Verify each fix visually: render stills (several times per affected line, incl. the transition frames for timing/pop fixes) to EP/qa_fix/ and LOOK at them with the Read tool. Iterate until right. Also re-render 1–2 untouched neighbouring lines to make sure you didn't break anything, and check the page has no JS errors (pg.on('pageerror')).
3. Re-render ONLY the frames of affected lines: for each affected line, frames from floor((t0-0.3)*24) to ceil((t1+0.3)*24) (clamp to [0, N)), plus any extra range your fix touches (e.g. transition between two lines). Write them to EP/frames_fix/f%05d.jpg using the global frame index, jpeg quality 92.
4. Splice without disk dumps: write a python script that
   - reads the current final mp4 video as raw rgb24 frames from an ffmpeg pipe (`ffmpeg -i OLD -f rawvideo -pix_fmt rgb24 -`),
   - for frame index f, substitutes EP/frames_fix/f{f:05d}.jpg if it exists,
   - pipes raw frames into an encoder: `ffmpeg -f rawvideo -pix_fmt rgb24 -s 1920x1080 -r 24 -i - -i OLD -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart NEW` (run under nice).
   Check NEW: same frame count and duration as OLD (±1 frame), audio stream copied, plays; extract frames at a few fixed spots and an unchanged spot and look at them.
5. Delete EP/frames_fix and EP/qa_fix big files when done (keep a few evidence jpgs ≤ 10 total).

Report back (Korean OK, concise): for each listed item — fixed / partially / skipped (+why); the exact code changes (file:function); NEW mp4 path, its duration and frame count vs OLD; list of changed line indices with their time ranges (needed later to re-cut Shorts); 2–4 evidence jpg paths (before/after). Do not upload anything anywhere.
