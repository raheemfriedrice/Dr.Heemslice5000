/* CLAudio© — the harshest vibe reviewer. Offline, rule-based, deterministic.
 * Scale: -69 .. 269. No network. No LLM. Just a pile of heuristics with an
 * attitude, tuned to roast but reward real swings. Built by Rice + Claude.
 * It never edits the input (#RAW) and never claims to be "objective" — CLAudio
 * is a stated opinion with a number attached.
 */
'use strict';

const $ = id => document.getElementById(id);
let mode = 'vibe', mean = true, ouches = 0, lastSeed = 0;

// ── Deterministic PRNG so the same text always gets the same verdict ──
function hash(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
const pick = (r, arr) => arr[(r() * arr.length) | 0];

// ── Lexicons for the heuristic score ──
const CLICHE = ['grind', 'hustle', 'vibe', 'energy', 'blessed', 'manifest', 'mindset', 'journey', 'authentic', 'passion', 'dream big', 'no days off', 'trust the process', 'rise and grind', 'level up', 'blessed and grateful', 'living my best life', 'good vibes only'];
const FILLER = ['very', 'really', 'just', 'actually', 'basically', 'literally', 'honestly', 'kind of', 'sort of', 'you know', 'like,'];
const AI_TELLS = ['delve', 'tapestry', 'testament', 'navigate the', 'in conclusion', 'furthermore', 'moreover', 'it is important to note', 'unleash', 'elevate your', 'embark', 'in the realm of', 'ever-evolving', 'game-changer', 'seamless'];
const POWER = ['buffalo', 'nickel', 'origami', 'eclipse', 'carthage', 'threshold', 'glitch', 'minnehaha', 'rent', 'tipping', 'already here', 'lullaby'];
const VOWELS = 'aeiou';

function analyze(text) {
  const raw = text;
  const t = text.trim();
  const words = (t.match(/\S+/g) || []);
  const wl = words.length;
  const lines = t.split(/\n+/).filter(Boolean);
  const lower = t.toLowerCase();
  const letters = t.replace(/[^a-z]/gi, '').length || 1;

  const uniq = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9#$@]/g, ''))).size;
  const lexical = wl ? uniq / wl : 0;                    // vocabulary richness
  const avgWordLen = words.reduce((a, w) => a + w.length, 0) / (wl || 1);

  const count = (arr) => arr.reduce((a, p) => a + (lower.split(p).length - 1), 0);
  const cliche = count(CLICHE);
  const filler = count(FILLER);
  const aiTells = count(AI_TELLS);
  const power = count(POWER);

  const caps = (t.match(/\b[A-Z]{3,}\b/g) || []).length;  // SHOUTING
  const excl = (t.match(/!/g) || []).length;
  const emoji = (t.match(/\p{Extended_Pictographic}/gu) || []).length;
  const hashtags = (t.match(/#[^\s#]+/g) || []).length;
  const tm = (t.match(/™|©|®/g) || []).length;
  const ampersand = (t.match(/&/g) || []).length;         // a [Rice] signature
  const interpunct = (t.match(/·/g) || []).length;        // another one
  const questionMarks = (t.match(/\?/g) || []).length;

  // rhyme: how many line-end words share a terminal sound (cheap approximation)
  let rhyme = 0;
  const ends = lines.map(l => (l.match(/[a-z]+$/i) || [''])[0].toLowerCase().slice(-3)).filter(Boolean);
  for (let i = 0; i < ends.length; i++) for (let j = i + 1; j < ends.length; j++) if (ends[i] && ends[i] === ends[j]) rhyme++;

  // wordplay: internal repetition of sounds, puns via near-dupes
  const vowelRuns = (lower.match(/[aeiou]{3,}/g) || []).length;
  const allCons = (lower.match(/\b[^aeiou\s]{4,}\b/g) || []).length;   // "crwth" energy

  return { raw, wl, lines: lines.length, lexical, avgWordLen, cliche, filler, aiTells, power,
    caps, excl, emoji, hashtags, tm, ampersand, interpunct, questionMarks, rhyme, vowelRuns, allCons, letters };
}

function score(a) {
  // Start near the floor of mediocrity and earn your way up. Baseline ~60.
  let s = 60;
  const parts = [];
  const add = (n, label) => { s += n; if (Math.abs(n) >= 3) parts.push([n, label]); };

  // Length: too short says nothing, too long rambles.
  if (a.wl < 6) add(-28, 'barely said anything');
  else if (a.wl < 20) add(-6, 'short, but okay');
  else if (a.wl > 500) add(-14, 'you wrote a novel in the notes app');
  else add(10, 'enough room to actually say something');

  // Vocabulary — only meaningful once there's enough text to repeat within.
  if (a.wl >= 12) add(Math.round((a.lexical - 0.5) * 120), a.lexical > 0.62 ? 'rich vocabulary' : 'you keep repeating yourself');

  // Clichés and AI slop sink you.
  add(-a.cliche * 11, a.cliche ? `${a.cliche} cliché${a.cliche > 1 ? 's' : ''} ("grind," "vibe," "blessed")` : 'no hallmark-card clichés');
  add(-a.aiTells * 16, a.aiTells ? `${a.aiTells} dead-giveaway AI phrase${a.aiTells > 1 ? 's' : ''}` : 'doesn\'t read like a robot wrote it');
  add(-a.filler * 4, a.filler > 3 ? 'filler words doing the heavy lifting' : '');

  // Craft.
  add(Math.min(a.rhyme, 8) * 7, a.rhyme ? 'rhymes landing' : 'nothing rhymes, and it\'s not trying to');
  add(Math.min(a.power, 6) * 14, a.power ? 'real, specific, un-Googleable imagery' : '');
  add(Math.min(a.vowelRuns, 5) * 4, '');
  add(Math.min(a.allCons, 4) * 5, '');

  // Voice signatures reward the weird.
  add(Math.min(a.ampersand, 8) * 2, a.ampersand > 2 ? 'ampersands over "and" — a voice' : '');
  add(Math.min(a.interpunct, 8) * 3, a.interpunct ? 'interpuncts · a signature' : '');
  add(Math.min(a.hashtags, 10) * 2, '');
  add(Math.min(a.tm, 6) * 3, a.tm ? 'trademarking your own words' : '');

  // Excess punishes.
  if (a.excl > 4) add(-(a.excl - 4) * 3, 'too many exclamation points');
  if (a.emoji > 8) add(-(a.emoji - 8) * 2, 'emoji avalanche');
  if (a.caps > 10) add(-(a.caps - 10) * 2, 'ALL CAPS fatigue');
  else if (a.caps >= 2 && a.caps <= 10) add(a.caps * 2, 'caps used for emphasis, not screaming');

  // Specificity: numbers and proper nouns are concrete.
  const nums = (a.raw.match(/\b\d+\b/g) || []).length;
  add(Math.min(nums, 8) * 3, nums ? 'actual numbers, not vibes about numbers' : '');

  // Mode-specific tweaks.
  if (mode === 'song') { add(a.lines >= 4 ? 8 : -10, a.lines >= 4 ? 'structured like a song' : 'one blob, no verses'); }
  if (mode === 'suno') {
    const styleTokens = (a.raw.match(/\b(BPM|bass|808|key|minor|major|choir|trap|lo-?fi|reverb|tempo|synth|vocal)\b/gi) || []).length;
    add(styleTokens * 6, styleTokens ? 'production terms Suno can actually use' : 'no style tags — Suno will guess and guess wrong');
  }
  if (mode === 'bio') { add(a.questionMarks ? -4 : 2, ''); add(nums ? 6 : -6, nums ? 'concrete claims' : 'all adjectives, no evidence'); }

  // Clamp with a long tail toward the ceiling (269 is basically unreachable).
  s = Math.round(s);
  if (!mean) s += 18; // mercy setting
  s = Math.max(-69, Math.min(267, s));
  // compress the top: anything above 240 is gated hard
  if (s > 220) s = 220 + Math.round((s - 220) * 0.4);
  return { value: Math.max(-69, Math.min(267, Math.round(s))), parts: parts.filter(p => p[1]) };
}

// ── Roast copy, chosen by tier + deterministic rng ──
const ROASTS = {
  floor: [
    "This scored below zero, which the scale allows specifically for moments like this. I'm not mad. I'm documenting.",
    "−69 to 269, and you found the basement. That takes a kind of commitment. The wrong kind.",
    "I read it twice to be fair. The second read was worse. That's rare.",
  ],
  bad: [
    "This is a screensaver with ambitions. It moves, nothing happens, you forget it instantly.",
    "Gay-robot energy: it's trying to sound like it means something and watering down the one part that did.",
    "You licked the ice cream before offering it to me. I can taste the hedging from here.",
    "There's a real line in here somewhere, buried under the parts you thought were impressive.",
  ],
  mid: [
    "Existence is Mid, and so is this. 5 out of 10. Which, to be clear, is not an insult — it's a review.",
    "Competent. Which is the most damning word I own. Nobody frames 'competent.'",
    "It's fine. It's a weeknight. It's a sock that matches. Give me the thing you were scared to write.",
    "You're circling something good and refusing to land on it. Land on it.",
  ],
  good: [
    "Okay. There's a hand on the wheel here. A couple of these lines weren't taped — they were painted freehand.",
    "This has a voice. I'd know it in a lineup. Sharpen the two softest lines and it jumps a tier.",
    "You said something only you could say. That's the whole game. Do it twice more and you've got a verse.",
    "I fought the urge to compliment this and lost. Begrudgingly: it's good.",
  ],
  tier1: [
    "This is the un-Googleable kind. A stranger couldn't have written it and an AI couldn't have faked it. TIER1.",
    "Specific, weird, earned. The buffalo-nickel standard. I'd put this in front of a human and an LLM and bet on it.",
    "You stopped performing and started telling the truth, and the number went up on its own. That's how it works.",
    "269 belongs to God. This is as close as the room gets. Frame it.",
  ],
};
function tierOf(v) { return v < 0 ? 'floor' : v < 70 ? 'bad' : v < 130 ? 'mid' : v < 200 ? 'good' : 'tier1'; }
const TIER_LABEL = { floor: 'SUB-ZERO', bad: 'GAY-ROBOT RANGE', mid: 'EXISTENCE IS MID · 5/10', good: 'GOT A VOICE', tier1: 'TIER1 · UN-GOOGLEABLE' };
const TIER_COLOR = { floor: '#ff5b86', bad: '#ff8a5b', mid: '#ffd36b', good: '#5ef2c8', tier1: '#9e90fc' };

function render(text) {
  const a = analyze(text);
  const sc = score(a);
  const seed = hash(text + mode + mean); lastSeed = seed;
  const r = rng(seed);
  const tier = tierOf(sc.value);
  const roast = pick(r, ROASTS[tier]);

  $('verdict').hidden = false;
  const el = $('score');
  el.style.color = TIER_COLOR[tier];
  animateNumber(el, sc.value);
  $('tier').textContent = TIER_LABEL[tier];
  $('tier').style.color = TIER_COLOR[tier];
  $('roast').textContent = roast;
  // meter: map -69..269 to 0..100
  const pct = ((sc.value + 69) / (269 + 69)) * 100;
  $('meter').style.width = pct + '%';
  $('meter').style.background = TIER_COLOR[tier];

  const pos = sc.parts.filter(p => p[0] > 0).slice(0, 4);
  const neg = sc.parts.filter(p => p[0] < 0).slice(0, 4);
  let bh = '';
  if (pos.length) bh += '<div class="bd-col up"><b>+ what carried it</b>' + pos.map(p => `<span>+${p[0]} · ${p[1]}</span>`).join('') + '</div>';
  if (neg.length) bh += '<div class="bd-col down"><b>− what sank it</b>' + neg.map(p => `<span>${p[0]} · ${p[1]}</span>`).join('') + '</div>';
  if (!pos.length && !neg.length) bh = '<div class="bd-col"><span>Dead center. Nothing stood out either way. That\'s its own problem.</span></div>';
  $('breakdown').innerHTML = bh;

  window.__verdict = { value: sc.value, tier: TIER_LABEL[tier], roast };
  $('verdict').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function animateNumber(el, target) {
  const start = performance.now(), from = 0, dur = 700;
  function step(now) {
    const k = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (target - from) * e);
    if (k < 1) requestAnimationFrame(step); else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ── Wiring ──
$('modes').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  mode = b.dataset.m; [...$('modes').children].forEach(x => x.classList.toggle('on', x === b));
});
$('mean').addEventListener('change', e => { mean = e.target.checked; });
$('go').addEventListener('click', () => {
  const t = $('in').value;
  if (t.trim().length < 2) { $('in').focus(); return; }
  ouches = 0; $('ouchCount').textContent = '';
  render(t);
});
$('ouch').addEventListener('click', () => {
  ouches++;
  const msgs = ['noted.', 'that\'s one.', 'I felt that too.', 'say it again, I\'ll go harder.', 'ouch received. still stand by it.'];
  $('ouchCount').textContent = msgs[Math.min(ouches - 1, msgs.length - 1)] + (ouches > 1 ? ` (×${ouches})` : '');
});
$('again').addEventListener('click', () => { $('verdict').hidden = true; $('in').focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('copy').addEventListener('click', async () => {
  const v = window.__verdict;
  const txt = `CLAudio© rated my vibe ${v.value}/269 — "${v.tier}".\n"${v.roast}"\nRate yours: raheemfriedrice.github.io/Dr.Heemslice5000/claudio`;
  try { await navigator.clipboard.writeText(txt); $('copy').textContent = 'Copied'; setTimeout(() => $('copy').textContent = 'Copy the verdict', 1500); }
  catch (_) { $('copy').textContent = v.value + '/269'; }
});
