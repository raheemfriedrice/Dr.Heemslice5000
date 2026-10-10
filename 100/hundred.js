/* The 100 — Legacy Contract. A page-a-day autobiography writer.
 * #RAW: no autocorrect, no edits, no review. Saved to this device as you type.
 * 100 pages, progress, titles, export/import. Built by Rice + Claude.
 */
'use strict';

const N = 100;
const KEY = 'hundred.v1';
const $ = id => document.getElementById(id);

// pages[i] = { t: title, b: body, w: wordcount, done: bool, edited: ts }
let book = load();
let cur = clampPage(book.last || 0);

function blank() {
  return { pages: Array.from({ length: N }, () => ({ t: '', b: '', w: 0, done: false, edited: 0 })), last: 0, started: Date.now() };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.pages)) {
        while (d.pages.length < N) d.pages.push({ t: '', b: '', w: 0, done: false, edited: 0 });
        d.pages.length = N;
        return d;
      }
    }
  } catch (_) {}
  return blank();
}
let saveTimer;
function save(now) {
  clearTimeout(saveTimer);
  const go = () => { try { localStorage.setItem(KEY, JSON.stringify(book)); } catch (_) {} };
  if (now) go(); else saveTimer = setTimeout(go, 400);
}
function clampPage(i) { return Math.max(0, Math.min(N - 1, i | 0)); }
function countWords(s) { return (s.trim().match(/\S+/g) || []).length; }
function pagesDone() { return book.pages.filter(p => p.w >= 1).length; }
function wordsTotal() { return book.pages.reduce((a, p) => a + p.w, 0); }

// ── Render current page ──
function showPage(i, focus) {
  cur = clampPage(i); book.last = cur;
  const p = book.pages[cur];
  $('title').value = p.t;
  $('body').value = p.b;
  $('pageLabel').textContent = `Page ${cur + 1} / ${N}`;
  updateMeta();
  updateProg();
  $('prev').disabled = cur === 0;
  $('next').disabled = cur === N - 1;
  if (focus) $('body').focus();
  $('pageView').scrollTop = 0;
  save();
}

function updateMeta() {
  const p = book.pages[cur];
  const ed = p.edited ? ' · saved ' + timeAgo(p.edited) : '';
  $('meta').textContent = `${p.w} word${p.w === 1 ? '' : 's'}${ed}`;
}
function updateProg() {
  const done = pagesDone();
  $('prog').style.width = (done / N * 100) + '%';
}
function timeAgo(ts) {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

// ── Editing (RAW — store exactly what's typed) ──
$('body').addEventListener('input', () => {
  const p = book.pages[cur];
  p.b = $('body').value;
  p.w = countWords(p.b);
  p.done = p.w >= 1;
  p.edited = Date.now();
  updateMeta(); updateProg(); save();
});
$('title').addEventListener('input', () => {
  const p = book.pages[cur];
  p.t = $('title').value;
  p.edited = Date.now();
  save();
});

// ── Nav ──
$('prev').onclick = () => showPage(cur - 1, true);
$('next').onclick = () => showPage(cur + 1, true);
document.addEventListener('keydown', e => {
  if (document.activeElement === $('body') || document.activeElement === $('title')) return;
  if (e.key === 'ArrowLeft') showPage(cur - 1);
  if (e.key === 'ArrowRight') showPage(cur + 1);
});
// swipe
let tx = 0, ty = 0;
$('pageView').addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
$('pageView').addEventListener('touchend', e => {
  if (document.activeElement === $('body') || document.activeElement === $('title')) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? showPage(cur + 1) : showPage(cur - 1); }
}, { passive: true });

// ── TOC ──
function openToc() {
  const g = $('grid'); g.innerHTML = '';
  book.pages.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'cell' + (p.w >= 1 ? ' filled' : '') + (i === cur ? ' cur' : '');
    b.innerHTML = `<span class="cell__n">${i + 1}</span>${p.t ? `<span class="cell__t">${escapeHtml(p.t)}</span>` : (p.w ? `<span class="cell__w">${p.w}w</span>` : '')}`;
    b.onclick = () => { closeSheets(); showPage(i, true); };
    g.appendChild(b);
  });
  $('tocSub').textContent = `${pagesDone()} of ${N} pages started · ${wordsTotal().toLocaleString()} words total`;
  $('toc').hidden = false;
}
function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
$('toToc').onclick = openToc;
$('tocX').onclick = closeSheets;

// ── Menu / export / import ──
$('menuBtn').onclick = () => {
  $('savedInfo').textContent = `${pagesDone()}/${N} pages · ${wordsTotal().toLocaleString()} words · started ${book.started ? timeAgo(book.started) : '—'}`;
  $('menu').hidden = false;
};
$('menuX').onclick = closeSheets;
function closeSheets() { $('toc').hidden = true; $('menu').hidden = true; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheets(); });

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
$('exp').onclick = () => { download('the-100-backup.json', JSON.stringify(book), 'application/json'); toast('Backup saved. Keep it safe.'); };
$('expTxt').onclick = () => {
  let out = 'THE 100 — Legacy Contract\n\n';
  book.pages.forEach((p, i) => {
    if (!p.b.trim() && !p.t.trim()) return;
    out += `────────────────────\nPAGE ${i + 1}${p.t ? ' — ' + p.t : ''}\n────────────────────\n${p.b}\n\n`;
  });
  download('the-100.txt', out, 'text/plain');
  toast('Readable copy saved.');
};
$('imp').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d || !Array.isArray(d.pages)) throw 0;
      if (!confirm('Importing replaces everything currently on this device. Continue?')) return;
      while (d.pages.length < N) d.pages.push({ t: '', b: '', w: 0, done: false, edited: 0 });
      d.pages.length = N;
      book = d; save(true); closeSheets(); showPage(book.last || 0); toast('Imported.');
    } catch (_) { toast('That file could not be read.'); }
  };
  r.readAsText(f);
  e.target.value = '';
};

let toastT;
function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }

// periodic "saved X ago" refresh
setInterval(updateMeta, 30000);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
showPage(cur);
