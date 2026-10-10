/* The 100 — Legacy Contract.
 * 10 chapters x 10 pages. A page a day. A must-do at the foot of every page
 * ("100 Pages Total with Each Must Do before I die at the footnote & a
 * completed rate"). Color-coded pages, margin notes, a streak, prompts,
 * styled book export. #RAW: no autocorrect, no edits, nothing sent anywhere.
 * Built by Rice + Claude.
 */
'use strict';

const N = 100, PER = 10;
const KEY = 'hundred.v1';
const $ = id => document.getElementById(id);
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const CANON = '"All 100 Pages Must Be Completed Before I Die."';

const COLORS = [
  { id: 'violet', hex: '#9e90fc', label: 'Story' },
  { id: 'gold',   hex: '#ffd36b', label: 'Wins · #SnackGods' },
  { id: 'teal',   hex: '#7fe0b0', label: '#Waterthoughts' },
  { id: 'pink',   hex: '#ff7aa2', label: 'Heart' },
  { id: 'orange', hex: '#ff9a4d', label: '#MeanRaheem' },
  { id: 'gray',   hex: '#9a9079', label: '#RAW · unsorted' },
];

// Page prompts: optional sparks for an empty page. Never inserted into the
// page text — they only show as the placeholder.
const PROMPTS = [
  'Write the first room you remember. Not the house — the room.',
  'A time you were early to something that had not happened yet.',
  'The best meal you ever cooked, and who didn\'t deserve it.',
  'Something you lost that you never went back for.',
  'The loudest silence you have ever been in.',
  'A coin, a key, or a receipt you kept for no reason. Why.',
  'The first time you got paid for something you would have done free.',
  'Write the rules of a game you made up as a kid.',
  'A stranger who said one sentence you still carry.',
  'What you were doing the moment you decided to stop asking permission.',
  'The worst advice you ever followed all the way.',
  'A song that played at exactly the wrong time.',
  'Describe your hands to someone who will never see them.',
  'The bravest thing you did that nobody clapped for.',
  'A door you walked out of and why you didn\'t slam it.',
  'Write about a smell that time-travels you.',
  'The last thing you built with your hands.',
  'A bet you won and a bet you should have lost.',
  'The job you were best at and why you left it.',
  'Write a letter to the version of you from ten years ago. Keep it short.',
  'The most expensive two dollars you ever spent.',
  'A rule you live by that you made up yourself.',
  'Who taught you to read, and what did you read first.',
  'Write the weather on the best day of your life.',
  'Something you\'re proud of that sounds stupid out loud.',
  'A fight you\'re glad you lost.',
  'The kitchen you learned in.',
  'A promise you kept that cost you something.',
  'Write about a car and what happened inside it.',
  'The first time you felt famous, even for ten people.',
  'What you do at 3 a.m. when the structure disappears.',
  'An apology you never sent. Send it here.',
  'The animal you trust more than most people.',
  'A word you invented and what it means.',
  'Describe the view from the lowest point.',
  'A day you were a hero by accident.',
  'Write a scene where you\'re the villain. Part time.',
  'What your handwriting says about you.',
  'The longest night and what ended it.',
  'A thing everyone else got wrong about you.',
  'The most beautiful line you\'ve ever seen painted, built, or written.',
  'Write the speech you\'d give if you won something tomorrow.',
  'What you\'d put in a time capsule and who opens it.',
  'A street you could walk blindfolded.',
  'The first song you made and how it sounded in your head.',
  'Something you forgave and something you didn\'t.',
  'Write about money without using a number.',
  'A teacher you hated who turned out to be right.',
  'The weirdest thing in your pockets right now.',
  'Halfway. Write what you know now that you didn\'t on page one.',
  'A time you gave someone your last of something.',
  'Write a dream you had more than once.',
  'The first time you saw your parents as people.',
  'A habit that saved you.',
  'A habit that almost didn\'t.',
  'Describe your perfect Sunday at 10:22 p.m.',
  'What you\'d tell a kid who reminds you of you.',
  'A building that made your neck go up.',
  'Write about being late, but make it beautiful.',
  'The joke only you think is funny. Explain it badly.',
  'A risk you took that nobody noticed.',
  'Write the inside of your head as a map.',
  'Something you made that outlived its purpose.',
  'A goodbye that wasn\'t dramatic but should have been.',
  'Three things you\'re sure of. One you used to be sure of.',
  'The best compliment you ever received from an enemy.',
  'Write a page in one breath. No stopping.',
  'What your name means to you, not the dictionary.',
  'A meal you\'d eat for the rest of your life and who\'s at the table.',
  'The time you were absolutely, publicly wrong.',
  'Write a recipe for your mood today.',
  'Someone you\'d like to meet again, and what you\'d say first.',
  'The most "you" thing you\'ve ever done.',
  'A place that closed and took something with it.',
  'Write about the color violet without saying violet.',
  'An object you\'d save from a fire.',
  'The day the world felt small.',
  'The day the world felt enormous.',
  'Something a machine got right about you.',
  'Write a page for the people who will read this after you.',
  'A moment you were completely present.',
  'What you\'d build if money were not a word.',
  'The best thing about being alone.',
  'The best thing about not being.',
  'A secret you can tell now.',
  'Write what winning looks like from the inside.',
  'A loss that turned into a lesson, and the lesson.',
  'Describe a hug you still feel.',
  'What you hope someone says at your egg toss.',
  'Ten pages left. What still needs saying?',
  'A line you\'d want carved somewhere.',
  'The truest sentence you know.',
  'Write about the hyphen between two dates.',
  'Who you\'re writing this for, honestly.',
  'Something you finally finished.',
  'What you\'re still not finished with.',
  'A thank-you, handwritten in spirit.',
  'Write the morning after the last page.',
  'Page 99. Say the thing.',
  'Page 100. Close the book, or don\'t.',
];

// ── State ────────────────────────────────────────────────────
function blankPage() { return { t: '', b: '', w: 0, edited: 0, c: '', n: '', m: '', md: false }; }
function blank() {
  return {
    pages: Array.from({ length: N }, blankPage),
    last: 0, started: Date.now(),
    chapters: ROMAN.map(r => 'Chapter ' + r),
    colorLabels: Object.fromEntries(COLORS.map(c => [c.id, c.label])),
    days: [],                       // YYYY-MM-DD dates with writing (for the streak)
  };
}
function normalize(d) {
  const b = blank();
  if (!d || !Array.isArray(d.pages)) return b;
  b.pages = d.pages.slice(0, N).map(p => Object.assign(blankPage(), p || {}));
  while (b.pages.length < N) b.pages.push(blankPage());
  b.last = Math.max(0, Math.min(N - 1, d.last | 0));
  b.started = d.started || Date.now();
  if (Array.isArray(d.chapters)) d.chapters.slice(0, PER).forEach((c, i) => { if (typeof c === 'string' && c.trim()) b.chapters[i] = c; });
  if (d.colorLabels) Object.assign(b.colorLabels, d.colorLabels);
  if (Array.isArray(d.days)) b.days = d.days.filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x));
  // Recover streak days from page timestamps for books saved before v2.
  b.pages.forEach(p => { if (p.edited && p.w > 0) addDay(b, dayOf(p.edited)); });
  return b;
}
function load() { try { const raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch (_) {} return blank(); }
let book = load();
let cur = book.last;

let saveTimer;
function save(now) {
  clearTimeout(saveTimer);
  const go = () => { try { localStorage.setItem(KEY, JSON.stringify(book)); } catch (_) { toast('Storage is full or blocked — export a backup now.'); } };
  if (now) go(); else saveTimer = setTimeout(go, 350);
}

// ── Helpers ──────────────────────────────────────────────────
const countWords = s => (s.trim().match(/\S+/g) || []).length;
const started = () => book.pages.filter(p => p.w > 0).length;
const totalWords = () => book.pages.reduce((a, p) => a + p.w, 0);
const mustDone = () => book.pages.filter(p => p.md).length;
const mustSet = () => book.pages.filter(p => p.m.trim()).length;
const chapterOf = i => Math.floor(i / PER);
const colorHex = id => (COLORS.find(c => c.id === id) || {}).hex || '';
function dayOf(ts) { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function addDay(b, day) { if (!b.days.includes(day)) { b.days.push(day); b.days.sort(); } }
function streak() {
  const set = new Set(book.days);
  let n = 0; const d = new Date();
  if (!set.has(dayOf(d))) d.setDate(d.getDate() - 1);   // today not written yet: streak still alive from yesterday
  while (set.has(dayOf(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function timeAgo(ts) {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ── Page view ────────────────────────────────────────────────
function buildSwatches() {
  const w = $('swatches'); w.innerHTML = '';
  COLORS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sw'; b.style.setProperty('--c', c.hex);
    b.setAttribute('role', 'radio'); b.dataset.id = c.id;
    b.title = book.colorLabels[c.id] || c.label;
    b.setAttribute('aria-label', 'Color: ' + b.title);
    b.onclick = () => {
      const p = book.pages[cur];
      p.c = p.c === c.id ? '' : c.id; p.edited = p.edited || Date.now();
      paintColor(); save();
    };
    w.appendChild(b);
  });
}
function paintColor() {
  const p = book.pages[cur];
  document.documentElement.style.setProperty('--page', colorHex(p.c) || 'transparent');
  [...$('swatches').children].forEach(b => {
    const on = b.dataset.id === p.c;
    b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
  });
}

function showPage(i, focus, adopt) {
  cur = Math.max(0, Math.min(N - 1, i | 0));
  if (!adopt) book.last = cur;
  const p = book.pages[cur];
  $('title').value = p.t;
  $('body').value = p.b;
  $('body').placeholder = PROMPTS[cur] ? 'Prompt: ' + PROMPTS[cur] + '\n\n(Or ignore it. Write it #RAW. No autocorrect, no edits, no one but you.)' : 'Write it #RAW.';
  $('notes').value = p.n;
  $('notesBox').open = !!p.n;
  $('mdText').value = p.m;
  $('mdDone').checked = !!p.md;
  $('mdNum').textContent = 'Must-do #' + (cur + 1);
  $('pageLabel').textContent = `Page ${cur + 1} / ${N}`;
  $('chapLabel').textContent = book.chapters[chapterOf(cur)];
  $('prev').disabled = cur === 0;
  $('next').disabled = cur === N - 1;
  paintColor(); updateMeta(); updateProg(); updateStreak();
  $('pageView').scrollTop = 0;
  if (focus) $('body').focus({ preventScroll: true });
  if (!adopt) save();
}
function updateMeta() {
  const p = book.pages[cur];
  $('meta').textContent = `${p.w} word${p.w === 1 ? '' : 's'}${p.edited ? ' · saved ' + timeAgo(p.edited) : ''} · ${mustDone()}/${N} must-dos done`;
}
function updateProg() { $('prog').style.width = (started() / N * 100) + '%'; }
function updateStreak() {
  const s = streak();
  $('streak').textContent = s ? `🔥 ${s}-day streak` : 'Write today to start a streak';
  $('streak').classList.toggle('hot', s > 0);
}

// ── Editing (store exactly what is typed) ────────────────────
function touch() {
  const p = book.pages[cur];
  p.edited = Date.now();
  if (p.w > 0) addDay(book, dayOf(p.edited));
}
$('body').addEventListener('input', () => {
  const p = book.pages[cur];
  p.b = $('body').value; p.w = countWords(p.b);
  touch(); updateMeta(); updateProg(); updateStreak(); save();
});
$('title').addEventListener('input', () => { book.pages[cur].t = $('title').value; touch(); save(); });
$('notes').addEventListener('input', () => { book.pages[cur].n = $('notes').value; touch(); save(); });
$('mdText').addEventListener('input', () => { book.pages[cur].m = $('mdText').value; save(); });
$('mdDone').addEventListener('change', () => {
  const p = book.pages[cur]; p.md = $('mdDone').checked;
  if (p.md) toast(p.m.trim() ? '✅ Crossed off: ' + p.m.trim() : '✅ Must-do #' + (cur + 1) + ' done');
  updateMeta(); save();
});
$('promptBtn').onclick = () => {
  const i = Math.floor(Math.random() * PROMPTS.length);
  $('body').placeholder = 'Prompt: ' + PROMPTS[i] + '\n\n(Or ignore it. #RAW.)';
  if (!$('body').value) $('body').focus({ preventScroll: true });
  toast('New prompt above. It never goes into your page.');
};

// ── Nav ──────────────────────────────────────────────────────
$('prev').onclick = () => showPage(cur - 1);
$('next').onclick = () => showPage(cur + 1);
const typing = () => ['body', 'title', 'notes', 'mdText'].includes(document.activeElement && document.activeElement.id);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') return closeSheets();
  if (typing()) return;
  if (e.key === 'ArrowLeft') showPage(cur - 1);
  if (e.key === 'ArrowRight') showPage(cur + 1);
});
let tx = 0, ty = 0;
$('pageView').addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
$('pageView').addEventListener('touchend', e => {
  if (typing()) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) showPage(cur + (dx < 0 ? 1 : -1));
}, { passive: true });

// ── TOC (chapters) ───────────────────────────────────────────
function openToc() {
  $('tocSub').textContent = `${started()}/${N} pages started · ${totalWords().toLocaleString()} words · must-dos ${mustDone()}/${N} done (${mustSet()} written) · 🔥 ${streak()}-day streak`;
  $('legend').innerHTML = COLORS.map(c => `<span class="lg"><i style="background:${c.hex}"></i>${esc(book.colorLabels[c.id] || c.label)}</span>`).join('');
  const wrap = $('chapters'); wrap.innerHTML = '';
  for (let ch = 0; ch < PER; ch++) {
    const pages = book.pages.slice(ch * PER, ch * PER + PER);
    const done = pages.filter(p => p.w > 0).length;
    const sec = document.createElement('section'); sec.className = 'chap';
    sec.innerHTML = `<h3><span>${ROMAN[ch]}</span> ${esc(book.chapters[ch])}<small>${done}/10</small></h3>`;
    const g = document.createElement('div'); g.className = 'grid';
    pages.forEach((p, k) => {
      const i = ch * PER + k;
      const b = document.createElement('button');
      b.className = 'cell' + (p.w > 0 ? ' filled' : '') + (i === cur ? ' cur' : '') + (p.md ? ' md' : '');
      if (p.c) b.style.setProperty('--c', colorHex(p.c));
      b.innerHTML = `<span class="cell__n">${i + 1}</span>${p.t ? `<span class="cell__t">${esc(p.t)}</span>` : (p.w ? `<span class="cell__w">${p.w}w</span>` : '')}${p.md ? '<span class="cell__md">✓</span>' : ''}`;
      b.setAttribute('aria-label', `Page ${i + 1}${p.t ? ': ' + p.t : ''}`);
      b.onclick = () => { closeSheets(); showPage(i, true); };
      g.appendChild(b);
    });
    sec.appendChild(g); wrap.appendChild(sec);
  }
  $('toc').hidden = false;
}
$('toToc').onclick = openToc;
$('tocX').onclick = closeSheets;

// ── Menu ─────────────────────────────────────────────────────
$('menuBtn').onclick = () => {
  $('savedInfo').textContent = `${started()}/${N} pages · ${totalWords().toLocaleString()} words · ${mustDone()} must-dos done · started ${timeAgo(book.started)}`;
  $('menu').hidden = false;
};
$('menuX').onclick = closeSheets;
function closeSheets() { ['toc', 'menu', 'rename'].forEach(id => $(id).hidden = true); }

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
$('exp').onclick = () => { download('the-100-backup.json', JSON.stringify(book), 'application/json'); toast('Backup saved. Keep it somewhere safe.'); };
$('expTxt').onclick = () => {
  let out = 'THE 100 — Legacy Contract\n' + CANON + '\n\n';
  book.pages.forEach((p, i) => {
    if (i % PER === 0) out += `\n════════ ${ROMAN[chapterOf(i)]}. ${book.chapters[chapterOf(i)]} ════════\n\n`;
    if (!p.b.trim() && !p.t.trim() && !p.m.trim()) return;
    out += `── PAGE ${i + 1}${p.t ? ' — ' + p.t : ''} ──\n${p.b}\n`;
    if (p.m.trim()) out += `[Must-do #${i + 1}: ${p.m}${p.md ? ' — DONE' : ''}]\n`;
    out += '\n';
  });
  download('the-100.txt', out, 'text/plain');
  toast('Readable copy saved.');
};
$('expBook').onclick = () => { download('the-100-book.html', bookHTML(), 'text/html'); toast('Styled book saved. Open it anywhere, or print it.'); };
function bookHTML() {
  let body = '';
  book.pages.forEach((p, i) => {
    if (i % PER === 0) body += `<h2 class="ch"><span>${ROMAN[chapterOf(i)]}</span>${esc(book.chapters[chapterOf(i)])}</h2>`;
    if (!p.b.trim() && !p.t.trim()) return;
    const c = colorHex(p.c) || '#9a9079';
    body += `<article style="--c:${c}"><header><b>Page ${i + 1}</b>${p.t ? ' — ' + esc(p.t) : ''}</header><div class="raw">${esc(p.b)}</div>` +
      `<footer>${CANON}${p.m.trim() ? `<br>Must-do #${i + 1}: ${esc(p.m)} ${p.md ? '✅' : '☐'}` : ''}</footer></article>`;
  });
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The 100</title><style>
body{background:#14110b;color:#f1ead9;font:1.12rem/1.75 Georgia,serif;max-width:720px;margin:0 auto;padding:24px 18px 80px}
h1{font:700 2.6rem/1 Impact,sans-serif;letter-spacing:.04em;color:#ffd36b;margin:20px 0 4px}.sub{color:#9a9079;font-style:italic}
h2.ch{font:700 1.6rem Impact,sans-serif;color:#ffd36b;margin:48px 0 12px;border-bottom:1px solid #2e281a;padding-bottom:6px}h2.ch span{color:#9e90fc;margin-right:10px}
article{border-left:3px solid var(--c);padding:4px 0 4px 16px;margin:26px 0;break-inside:avoid}header{font:600 .9rem system-ui,sans-serif;color:var(--c);letter-spacing:.04em;margin-bottom:8px}
.raw{white-space:pre-wrap}footer{font:italic .8rem Georgia,serif;color:#9a9079;margin-top:12px}
@media print{body{background:#fff;color:#111}footer,.sub{color:#555}}</style></head><body>
<h1>THE 100</h1><p class="sub">Legacy Contract · ${started()}/100 pages · ${totalWords().toLocaleString()} words · exported ${new Date().toLocaleDateString()}</p>${body}</body></html>`;
}
$('imp').onchange = e => readJSON(e, d => {
  if (!d || !Array.isArray(d.pages)) throw new Error('not a backup');
  if (!confirm('Restoring replaces everything on this device with the backup. Continue?')) return;
  book = normalize(d); save(true); closeSheets(); buildSwatches(); showPage(book.last); toast('Restored.');
});
// 100 Things import: [{n?, item, done?}] or {items:[...]} — fills empty must-do slots by number.
$('impThings').onchange = e => readJSON(e, d => {
  const items = Array.isArray(d) ? d : (d && Array.isArray(d.items) ? d.items : null);
  if (!items) throw new Error('no items');
  let placed = 0;
  items.forEach((it, k) => {
    const text = typeof it === 'string' ? it : (it && (it.item || it.text));
    if (!text) return;
    let idx = it && Number.isInteger(it.n) ? it.n - 1 : -1;
    if (idx < 0 || idx >= N || book.pages[idx].m.trim()) idx = book.pages.findIndex(p => !p.m.trim());
    if (idx < 0) return;
    book.pages[idx].m = String(text);
    if (it && (it.done === true || /done|complete|crossed/i.test(it.status || ''))) book.pages[idx].md = true;
    placed++;
  });
  save(true); showPage(cur); toast(`Placed ${placed} must-dos on page footers. Existing ones were not overwritten.`);
});
function readJSON(e, fn) {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { fn(JSON.parse(r.result)); } catch (_) { toast('That file could not be read.'); } };
  r.readAsText(f);
}

// ── Rename chapters & color meanings ─────────────────────────
$('editChapters').onclick = () => {
  const list = $('renameList'); list.innerHTML = '';
  book.chapters.forEach((name, i) => {
    const row = document.createElement('label'); row.className = 'rn';
    row.innerHTML = `<span>${ROMAN[i]}</span>`;
    const inp = document.createElement('input'); inp.value = name; inp.maxLength = 60; inp.spellcheck = false;
    inp.oninput = () => { book.chapters[i] = inp.value.trim() || ('Chapter ' + ROMAN[i]); save(); };
    row.appendChild(inp); list.appendChild(row);
  });
  COLORS.forEach(c => {
    const row = document.createElement('label'); row.className = 'rn';
    row.innerHTML = `<i style="background:${c.hex}"></i>`;
    const inp = document.createElement('input'); inp.value = book.colorLabels[c.id] || c.label; inp.maxLength = 40; inp.spellcheck = false;
    inp.oninput = () => { book.colorLabels[c.id] = inp.value.trim() || c.label; save(); buildSwatches(); paintColor(); };
    row.appendChild(inp); list.appendChild(row);
  });
  $('menu').hidden = true; $('rename').hidden = false;
};
$('renameX').onclick = () => { closeSheets(); showPage(cur); };

let toastT;
function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
setInterval(() => { updateMeta(); updateStreak(); }, 30000);
addEventListener('pagehide', () => save(true));
// Another tab (or window) saved newer writing: adopt it instead of overwriting it later.
addEventListener('storage', e => {
  if (e.key !== KEY || !e.newValue) return;
  try { clearTimeout(saveTimer); book = normalize(JSON.parse(e.newValue)); buildSwatches(); showPage(cur, false, true); } catch (_) {}
});
document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
buildSwatches();
showPage(cur);
