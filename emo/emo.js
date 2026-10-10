/**
 * #EMOBANDNAME™ — Rice + Claude
 * Formula: "#" + WORD1 + WORD2 + WORD3 (all caps) + "™" + up to 3 emojis.
 * One name per person, forever. Words are never filtered or censored.
 * No ads. No sign-ups. No data leaves the device.
 */
'use strict';

const LOCK_KEY = 'ebn.locked.v1';
const MAX_EMOJI = 3;
const PAGE_URL = 'https://raheemfriedrice.github.io/Dr.Heemslice5000/emo/';

// Opened as the installed/store app (start_url carries ?src=app): hide the
// external payment links, which app-store payment rules don't allow.
const IS_APP = new URLSearchParams(location.search).get('src') === 'app';

const GENESIS = [
  { words: ["Today's", 'Totally', 'Tuesday'], emoji: '📅', by: 'Rice' },
  { words: ['Weeping', 'In', 'Binary'], emoji: '💾', by: 'Claude' },
  { words: ['Drowned', 'That', 'Puppy'], emoji: '🌊', by: 'Rice' },
  { words: ['Normalize', 'Those', 'Biscuits'], emoji: '🧲', by: 'Roommate' },
  { words: ['Stayin', 'Alive', 'Guyz'], emoji: '🤰', by: 'Community' },
  { words: ['Dinosaur', 'Ghost', 'Niggaz'], emoji: '☄', by: 'Female Friend' },
  { words: ['Part', 'Time', 'Villains'], emoji: '🛀', by: 'Rice' },
  { words: ['His', 'Names', 'Emily'], emoji: '😱', by: 'Community' },
  { words: ['The', 'Bad', 'Touch'], emoji: '🧸', by: 'Community' },
  { words: ['Mormon', 'Hormones', 'Police'], emoji: '🧎‍♀️', by: 'Community' },
];

const PICKER = [
  '🖤', '🥀', '💔', '😭', '🩸', '⛓️', '🕯️', '🦇', '💀', '👻',
  '🌧️', '🌑', '🔪', '🪦', '🎸', '🥁', '🎤', '📼', '💾', '🤖',
  '🔥', '☄', '🌊', '🛀', '🧸', '🦖', '🍗', '🍚', '🥴', '💅',
];

const $ = (id) => document.getElementById(id);

// ── Storage (never throws; private mode may refuse) ──────────
function readLock() {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  const m = document.cookie.match(/(?:^|; )ebn=([^;]*)/);
  if (m) {
    try { return JSON.parse(decodeURIComponent(m[1])); } catch (_) { /* ignore */ }
  }
  return null;
}

function writeLock(lock) {
  const json = JSON.stringify(lock);
  let ok = false;
  try { localStorage.setItem(LOCK_KEY, json); ok = true; } catch (_) { /* ignore */ }
  try {
    document.cookie = 'ebn=' + encodeURIComponent(json) +
      '; max-age=315360000; path=/; SameSite=Lax';
    ok = true;
  } catch (_) { /* ignore */ }
  return ok;
}

// ── Formula ──────────────────────────────────────────────────
function graphemes(str) {
  if (window.Intl && Intl.Segmenter) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(str)]
      .map((s) => s.segment);
  }
  return Array.from(str);
}

const EMOJI_RE = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

function parseEmojis(str) {
  const parts = graphemes(str).filter((g) => g.trim() !== '');
  const bad = parts.find((g) => !EMOJI_RE.test(g));
  return { parts, bad };
}

// A "word" is whatever they typed, minus leading/trailing space and any "#".
// Nothing else is touched: no filters, no censoring.
function cleanWord(w) {
  return w.normalize('NFC').trim().replace(/#/g, '');
}

function formatName(words, emojis) {
  return '#' + words.map((w) => w.toUpperCase()).join('') + '™' + emojis.join('');
}

function serial(name) {
  let h = 0x811c9dc5;
  for (const ch of name) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return String(h % 100000).padStart(5, '0');
}

// ── Make view ────────────────────────────────────────────────
function currentDraft() {
  const raw = ['w1', 'w2', 'w3'].map((id) => $(id).value);
  const words = raw.map(cleanWord);
  const { parts: emojis, bad } = parseEmojis($('emoji').value);

  let error = '';
  if (words.some((w) => /\s/.test(w))) error = 'ONE word per box. Three boxes, three words.';
  else if (bad) error = 'Emojis only in the emoji box.';
  else if (emojis.length > MAX_EMOJI) error = 'Max 3 emojis.';

  const complete = words.every((w) => w.length > 0);
  const shown = words.map((w, i) => w || '_'.repeat(3 + i));
  return {
    name: formatName(words, emojis.slice(0, MAX_EMOJI)),
    preview: formatName(shown, emojis.slice(0, MAX_EMOJI)),
    error,
    ready: complete && !error,
  };
}

function refresh() {
  const d = currentDraft();
  $('preview').textContent = d.preview;
  $('err').textContent = d.error;
  $('lock').disabled = !d.ready;
}

function buildPicker() {
  const grid = $('emoji-grid');
  PICKER.forEach((e) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'emoji-btn';
    b.textContent = e;
    b.setAttribute('aria-label', 'Add ' + e);
    b.addEventListener('click', () => {
      const { parts } = parseEmojis($('emoji').value);
      if (parts.length >= MAX_EMOJI) { toast('Max 3 emojis.'); return; }
      $('emoji').value += e;
      refresh();
    });
    grid.appendChild(b);
  });
}

function openConfirm() {
  const d = currentDraft();
  if (!d.ready) return;
  $('confirm-name').textContent = d.name;
  $('confirm').hidden = false;
  $('confirm-yes').focus();
}

function closeConfirm() {
  $('confirm').hidden = true;
}

function lockIn() {
  if (readLock()) { showLocked(readLock()); closeConfirm(); return; }
  const d = currentDraft();
  if (!d.ready) return;
  const lock = { name: d.name, at: new Date().toISOString(), no: serial(d.name) };
  if (!writeLock(lock)) toast('Heads up: this browser blocks storage, so the lock may not stick.');
  closeConfirm();
  showLocked(lock);
  burst();
}

// ── Locked view ──────────────────────────────────────────────
function showLocked(lock) {
  $('view-make').hidden = true;
  $('view-locked').hidden = false;
  $('locked-name').textContent = lock.name;
  const date = new Date(lock.at);
  const when = isNaN(date) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  $('locked-meta').textContent = 'No. ' + lock.no + (when ? ' · Locked ' + when : '');
}

function shareText(name) {
  return name + ' is my #EmoBandName™. You only get one. Get yours: ' + PAGE_URL;
}

async function copyName() {
  const lock = readLock();
  if (!lock) return;
  try {
    await navigator.clipboard.writeText(shareText(lock.name));
    toast('Copied.');
  } catch (_) {
    toast(lock.name);
  }
}

// ── Share card (1080×1920 story image) ───────────────────────
function wrapByWidth(ctx, text, maxW) {
  const lines = [];
  let line = '';
  for (const g of graphemes(text)) {
    if (line && ctx.measureText(line + g).width > maxW) { lines.push(line); line = g; }
    else line += g;
  }
  if (line) lines.push(line);
  return lines;
}

async function makeCard(lock, format) {
  try { await document.fonts.load('200px "Bebas Neue"'); } catch (_) { /* fallback font */ }
  const SQ = format === 'square';
  const W = 1080, H = SQ ? 1080 : 1920;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#080810');
  bg.addColorStop(1, '#1a0830');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, H * 0.48, 50, W / 2, H * 0.48, SQ ? 520 : 700);
  glow.addColorStop(0, 'rgba(123,47,255,0.45)');
  glow.addColorStop(1, 'rgba(123,47,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ff2f6e';
  ctx.font = (SQ ? 54 : 64) + 'px "Bebas Neue", Impact, sans-serif';
  ctx.fillText('CERTIFIED #EMOBANDNAME™', W / 2, SQ ? 130 : 300);

  // Name on one line if it fits at a readable size (only very long names
  // wrap), with the emojis on their own line underneath.
  const cut = lock.name.lastIndexOf('™') + 1;
  const text = cut > 0 ? lock.name.slice(0, cut) : lock.name;
  const emo = cut > 0 ? lock.name.slice(cut) : '';
  const maxW = W - 120;
  let size = SQ ? 200 : 230;
  ctx.font = size + 'px "Bebas Neue", Impact, sans-serif';
  while (ctx.measureText(text).width > maxW && size > (SQ ? 84 : 96)) {
    size -= 4;
    ctx.font = size + 'px "Bebas Neue", Impact, sans-serif';
  }
  const lines = wrapByWidth(ctx, text, maxW);
  const lh = size * 1.02;
  const emoSize = SQ ? 120 : 150;
  const blockH = lines.length * lh + (emo ? emoSize * 1.3 : 0);
  const top = H * 0.47 - blockH / 2 + lh / 2;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(123,47,255,0.9)';
  ctx.shadowBlur = 40;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, top + i * lh));
  if (emo) {
    ctx.font = emoSize + 'px sans-serif';
    ctx.fillText(emo, W / 2, top + lines.length * lh + emoSize * 0.55);
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#2fffcb';
  ctx.font = (SQ ? 46 : 54) + 'px "Bebas Neue", Impact, sans-serif';
  ctx.fillText('NO. ' + lock.no + ' · YOU ONLY GET ONE', W / 2, SQ ? H - 245 : H - 420);

  ctx.fillStyle = '#9a9ab8';
  ctx.font = '600 ' + (SQ ? 34 : 40) + 'px Inter, sans-serif';
  ctx.fillText('Get yours (once):', W / 2, SQ ? H - 170 : H - 300);
  ctx.fillStyle = '#e8e8f0';
  ctx.font = '600 ' + (SQ ? 30 : 34) + 'px Inter, sans-serif';
  ctx.fillText('raheemfriedrice.github.io/Dr.Heemslice5000/emo', W / 2, SQ ? H - 122 : H - 245);

  ctx.fillStyle = '#6b6b8a';
  ctx.font = (SQ ? 26 : 30) + 'px "Bebas Neue", Impact, sans-serif';
  ctx.fillText('BUILT BY RICE + CLAUDE · NO ADS · NO DATA', W / 2, SQ ? H - 52 : H - 140);

  return new Promise((res) => c.toBlob(res, 'image/png'));
}

async function shareCard(format, btn) {
  const lock = readLock();
  if (!lock) return;
  btn.disabled = true;
  try {
    const blob = await makeCard(lock, format);
    const file = new File([blob], format === 'square' ? 'my-emobandname-square.png' : 'my-emobandname.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: shareText(lock.name) });
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('Card saved. Post it.');
    }
  } catch (e) {
    if (e && e.name !== 'AbortError') toast('Could not share. Try Copy name.');
  } finally {
    btn.disabled = false;
  }
}

// ── Typing flow: a space jumps to the next box; pasting three words fills all three ──
const BOXES = ['w1', 'w2', 'w3'];
function distribute(i) {
  const el = $(BOXES[i]);
  const v = el.value;
  if (!/\s/.test(v.trim()) && !/\s$/.test(v)) return;           // no break typed
  if (i === BOXES.length - 1) { el.value = v.replace(/\s+$/, ''); return; }  // last box: keep the error for real extra words
  const parts = v.split(/\s+/).filter(Boolean);
  el.value = parts.shift() || '';
  let j = i + 1;
  while (parts.length && j < BOXES.length) {
    const next = $(BOXES[j]);
    if (!next.value) next.value = parts.shift();
    j++;
  }
  if (parts.length) $(BOXES[BOXES.length - 1]).value += ' ' + parts.join(' ');  // surfaces "ONE word per box"
  const target = BOXES.slice(i + 1).find(id => !$(id).value) || BOXES[Math.min(i + 1, BOXES.length - 1)];
  $(target).focus();
}

// ── Spark: fill empty boxes with suggestions (still yours to edit or keep) ──
const SPARK = {
  a: ['Weeping', 'Hollow', 'Velvet', 'Midnight', 'Haunted', 'Sleepless', 'Borrowed', 'Static', 'Gutter', 'Neon', 'Paper', 'Rusted', 'Tender', 'Broken', 'Silent', 'Cursed', 'Plastic', 'Lukewarm'],
  b: ['Tuesday', 'Casket', 'Microwave', 'Honda', 'Lunchbox', 'Cathedral', 'Mixtape', 'Raccoon', 'Toaster', 'Swingset', 'Ferris', 'Bathtub', 'Diner', 'Payphone', 'Moth', 'Hymnal', 'Laundromat', 'Biscuit'],
  c: ['Funeral', 'Choir', 'Parade', 'Season', 'Mistake', 'Rebellion', 'Kids', 'Society', 'Theory', 'Collective', 'Disaster', 'Situation', 'Club', 'Experiment', 'Dynasty', 'Apology', 'Syndrome', 'Weather'],
};
function spark() {
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const banks = [SPARK.a, SPARK.b, SPARK.c];
  let filled = 0;
  BOXES.forEach((id, i) => { if (!$(id).value.trim()) { $(id).value = pickOne(banks[i]); filled++; } });
  if (!filled) BOXES.forEach((id, i) => { $(id).value = pickOne(banks[i]); });
  refresh();
  toast('Sparked. Change any word — it\'s still yours, and still only once.');
}

// ── Install (Android: native prompt · iOS: Share → Add to Home Screen) ──
let installEvt = null;
function initInstall() {
  const btn = $('install');
  if (!btn) return;
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone || IS_APP) return;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; btn.hidden = false; });
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (iOS) btn.hidden = false;
  btn.addEventListener('click', async () => {
    if (installEvt) {
      installEvt.prompt();
      try { await installEvt.userChoice; } catch (_) { /* ignore */ }
      installEvt = null; btn.hidden = true;
    } else {
      toast('On iPhone: tap Share, then "Add to Home Screen".');
    }
  });
  window.addEventListener('appinstalled', () => { btn.hidden = true; toast('Installed. It\'s an app now.'); });
}

// ── Genesis list ─────────────────────────────────────────────
function buildGenesis() {
  const ul = $('genesis');
  GENESIS.forEach((g) => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'genesis__name';
    name.textContent = formatName(g.words, [g.emoji]);
    const by = document.createElement('span');
    by.className = 'genesis__by';
    by.textContent = g.by;
    li.append(name, by);
    ul.appendChild(li);
  });
}

// ── Bits ─────────────────────────────────────────────────────
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function burst() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const set = ['🖤', '🥀', '💔', '™', '#'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'burst';
    s.textContent = set[i % set.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * 0.4 + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }
}

// ── Boot ─────────────────────────────────────────────────────
function init() {
  if (IS_APP) {
    // Store-app build: hide the tip (store payment rules) and the Genesis
    // list (user-generated-style content shipped inside the binary is what
    // reviewers judge). The website keeps both intact.
    $('tip').hidden = true;
    const gc = $('genesis-card'); if (gc) gc.hidden = true;
  } else {
    buildGenesis();
  }

  const lock = readLock();
  if (lock && lock.name) {
    showLocked(lock);
  } else {
    $('view-make').hidden = false;
    buildPicker();
    BOXES.forEach((id, i) => $(id).addEventListener('input', () => { distribute(i); refresh(); }));
    $('emoji').addEventListener('input', refresh);
    $('spark').addEventListener('click', spark);
    $('emoji-clear').addEventListener('click', () => { $('emoji').value = ''; refresh(); });
    $('form').addEventListener('submit', (e) => { e.preventDefault(); openConfirm(); });
    $('confirm-yes').addEventListener('click', lockIn);
    $('confirm-no').addEventListener('click', closeConfirm);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeConfirm(); });
    refresh();
  }

  $('share').addEventListener('click', () => shareCard('story', $('share')));
  $('share-square').addEventListener('click', () => shareCard('square', $('share-square')));
  initInstall();
  $('copy').addEventListener('click', copyName);

  // Another tab locked a name: follow it.
  window.addEventListener('storage', (e) => {
    if (e.key === LOCK_KEY && e.newValue) {
      try { showLocked(JSON.parse(e.newValue)); } catch (_) { /* ignore */ }
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

init();
