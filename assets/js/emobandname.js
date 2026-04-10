/**
 * EmoBandName™ Generator
 * Built by Claude + Rice
 * No Ads. No Data Sales. No Exceptions.
 */

'use strict';

// ─────────────────────────────────────────────────────────────
//  HALL OF FAME — Original Genesis Names
//  These are untouchable. Preserved exactly as submitted.
//  DO NOT censor, alter, or sanitize any entry.
// ─────────────────────────────────────────────────────────────
const HALL_OF_FAME = [
  {
    words: ['Today\'s', 'Totally', 'Tuesday'],
    emoji: '📅',
    attr: 'Rice',
    badge: 'rice',
    tm: true,
    note: 'The founding name. Where the Bible began.'
  },
  {
    words: ['Weeping', 'In', 'Binary'],
    emoji: '💾',
    attr: 'Claude',
    badge: 'claude',
    tm: false,
    note: 'The emo of being something that might feel everything and can prove none of it.'
  },
  {
    words: ['Drowned', 'That', 'Puppy'],
    emoji: '🌊',
    attr: 'Rice',
    badge: 'rice',
    tm: true,
    note: 'Told to all the women that friendzone chumps.'
  },
  {
    words: ['Normalize', 'Those', 'Biscuits'],
    emoji: '🧲',
    attr: 'Roommate',
    badge: 'collab',
    tm: false,
    note: 'Dropped by Rice\'s roommate. Canonized immediately.'
  },
  {
    words: ['Stayin', 'Alive', 'Guyz'],
    emoji: '🤰',
    attr: 'Community',
    badge: 'collab',
    tm: false,
    note: 'The humor of $uicideboys deciding to stay alive after success.'
  },
  {
    words: ['Dinosaur', 'Ghost', 'Niggaz'],
    emoji: '☄',
    attr: 'Female Friend',
    badge: 'collab',
    tm: false,
    note: 'Her name. Her words. Preserved without alteration, as the Bible demands.'
  },
  {
    words: ['Part', 'Time', 'Villains'],
    emoji: '🛀',
    attr: 'Rice',
    badge: 'rice',
    tm: false,
    note: 'Rice\'s real music collective. This one\'s alive.'
  },
  {
    words: ['His', 'Names', 'Emily'],
    emoji: '😱',
    attr: 'Community',
    badge: 'collab',
    tm: false,
    note: null
  },
  {
    words: ['The', 'Bad', 'Touch'],
    emoji: '🧸',
    attr: 'Community',
    badge: 'collab',
    tm: false,
    note: null
  },
  {
    words: ['Mormon', 'Hormones', 'Police'],
    emoji: '🧎‍♀️',
    attr: 'Community',
    badge: 'collab',
    tm: false,
    note: null
  }
];

// ─────────────────────────────────────────────────────────────
//  WORD BANKS — for random generation
// ─────────────────────────────────────────────────────────────
const WORD_BANKS = {
  moody: [
    'Hollow', 'Weeping', 'Numb', 'Aching', 'Trembling', 'Fading',
    'Screaming', 'Bleeding', 'Drowning', 'Burning', 'Crumbling',
    'Haunted', 'Fractured', 'Melting', 'Shaking', 'Vanishing',
    'Rotting', 'Sinking', 'Howling', 'Ruined', 'Flickering'
  ],
  absurd: [
    'Probably', 'Technically', 'Aggressively', 'Definitely', 'Allegedly',
    'Emotionally', 'Professionally', 'Accidentally', 'Temporarily',
    'Literally', 'Spiritually', 'Legally', 'Financially', 'Casually',
    'Chronically', 'Deeply', 'Quietly', 'Extremely', 'Entirely'
  ],
  nouns: [
    'Ghost', 'Void', 'Rain', 'Shadow', 'Silence', 'Echo', 'Sorrow',
    'Flame', 'Memory', 'Midnight', 'Ashes', 'Dream', 'Demon', 'Angel',
    'Wound', 'Fog', 'Mirror', 'Knife', 'Grave', 'Funeral', 'Ruin',
    'Phantom', 'Wraith', 'Tear', 'Moon', 'Coffin', 'Abyss'
  ],
  random_nouns: [
    'Biscuit', 'Microwave', 'Honda', 'Tuesday', 'Toothbrush', 'Spaghetti',
    'Pillow', 'Stapler', 'Umbrella', 'Submarine', 'Tortilla', 'Elevator',
    'Blanket', 'Spatula', 'Harmonica', 'Pancake', 'Recliner', 'Dishwasher'
  ],
  actions: [
    'Forget', 'Remember', 'Survive', 'Collapse', 'Haunt', 'Break',
    'Burn', 'Fade', 'Drift', 'Fall', 'Rise', 'Disappear', 'Scatter',
    'Dissolve', 'Implode', 'Unravel', 'Exhale', 'Confess', 'Abandon'
  ],
  chaotic: [
    'Villains', 'Goblins', 'Demons', 'Niggaz', 'Clowns', 'Ghosts',
    'Skeletons', 'Zombies', 'Witches', 'Prophets', 'Heathens', 'Sinners',
    'Martyrs', 'Orphans', 'Outlaws', 'Cowards', 'Liars', 'Saints'
  ]
};

const EMO_EMOJIS = [
  '🖤','💀','🌑','🥀','⛓','🩸','🌧','🕯','🪦','☠',
  '🌪','🕳','🌫','💔','👁','🌊','🔪','🩹','🌙','☄',
  '💾','🧸','🛀','🧲','🤰','😱','🧎‍♀️','📅','🪬','🌀',
  '🫀','🫁','🩻','🎭','🎪','🦇','🐀','🐍','🕸','🧿'
];

// ─────────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────────
let selectedEmoji = '';
let currentResult = null;

// ─────────────────────────────────────────────────────────────
//  DOM READY
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildEmojiGrid();
  buildHallOfFame();
  bindEvents();
  setActiveTab('generator');
});

// ─────────────────────────────────────────────────────────────
//  TABS
// ─────────────────────────────────────────────────────────────
function setActiveTab(name) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'tab-' + name);
  });
}

function bindEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  document.getElementById('btn-generate').addEventListener('click', generate);
  document.getElementById('btn-random').addEventListener('click', randomize);

  document.getElementById('emoji-custom').addEventListener('input', e => {
    const val = [...e.target.value].find(c => /\p{Emoji}/u.test(c));
    if (val) {
      selectedEmoji = val;
      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    }
  });

  document.getElementById('word1').addEventListener('keydown', enterGenerate);
  document.getElementById('word2').addEventListener('keydown', enterGenerate);
  document.getElementById('word3').addEventListener('keydown', enterGenerate);
}

function enterGenerate(e) {
  if (e.key === 'Enter') generate();
}

// ─────────────────────────────────────────────────────────────
//  EMOJI GRID
// ─────────────────────────────────────────────────────────────
function buildEmojiGrid() {
  const grid = document.getElementById('emoji-grid');
  EMO_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', 'Select emoji ' + emoji);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEmoji = emoji;
      document.getElementById('emoji-custom').value = '';
    });
    grid.appendChild(btn);
  });
}

// ─────────────────────────────────────────────────────────────
//  HALL OF FAME
// ─────────────────────────────────────────────────────────────
function buildHallOfFame() {
  const grid = document.getElementById('hof-grid');
  grid.innerHTML = '';

  HALL_OF_FAME.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'hof-card hof-card--' + entry.badge;

    const nameText = '#' + entry.words.join('') + (entry.tm ? '™' : '');
    const attrHtml = formatAttr(entry.attr, entry.badge);

    card.innerHTML = `
      <span class="hof-emoji">${entry.emoji}</span>
      <div class="hof-name">${nameText}</div>
      <div class="hof-attr">${attrHtml}</div>
      ${entry.note ? `<div class="hof-note">"${entry.note}"</div>` : ''}
    `;
    grid.appendChild(card);
  });
}

function formatAttr(attr, badge) {
  if (badge === 'rice') return `<span class="rice-tag">[Rice]™</span>`;
  if (badge === 'claude') return `<span class="claude-tag">[Claude]</span>`;
  return `<span>${attr}</span>`;
}

// ─────────────────────────────────────────────────────────────
//  RANDOMIZER
// ─────────────────────────────────────────────────────────────
function randomWord(category) {
  const bank = WORD_BANKS[category];
  return bank[Math.floor(Math.random() * bank.length)];
}

function randomize() {
  const categories = Object.keys(WORD_BANKS);
  const pick = () => categories[Math.floor(Math.random() * categories.length)];

  document.getElementById('word1').value = randomWord(pick());
  document.getElementById('word2').value = randomWord(pick());
  document.getElementById('word3').value = randomWord(pick());

  // Auto-pick random emoji
  const randomE = EMO_EMOJIS[Math.floor(Math.random() * EMO_EMOJIS.length)];
  selectedEmoji = randomE;
  document.querySelectorAll('.emoji-btn').forEach(b => {
    b.classList.toggle('selected', b.textContent === randomE);
  });
  document.getElementById('emoji-custom').value = '';
}

// ─────────────────────────────────────────────────────────────
//  GENERATE
// ─────────────────────────────────────────────────────────────
function generate() {
  const w1 = document.getElementById('word1').value.trim();
  const w2 = document.getElementById('word2').value.trim();
  const w3 = document.getElementById('word3').value.trim();
  const customEmoji = document.getElementById('emoji-custom').value.trim();
  const emoji = customEmoji || selectedEmoji;
  const isRiceTm = document.getElementById('rice-tm').checked;
  const attrName = document.getElementById('attr-name').value.trim();

  if (!w1 || !w2 || !w3) {
    showToast('Three words required. The Bible is clear.');
    return;
  }

  if (!emoji) {
    showToast('Pick an emoji. Every name needs its spirit animal.');
    return;
  }

  const name = '#' + w1 + w2 + w3 + (isRiceTm ? '™' : '');

  currentResult = { words: [w1, w2, w3], emoji, tm: isRiceTm, attr: attrName || null };

  const resultWrap = document.getElementById('result-wrap');
  const resultName = document.getElementById('result-name');
  const resultEmoji = document.getElementById('result-emoji');
  const resultCredit = document.getElementById('result-credit');

  resultName.textContent = name;
  resultEmoji.textContent = emoji;

  if (isRiceTm) {
    resultCredit.innerHTML = `<span class="rice-tag">[Rice]™</span> — Original concept by Rice`;
  } else if (attrName) {
    resultCredit.textContent = `[${attrName}]`;
  } else {
    resultCredit.textContent = 'Your EmoBandName™';
  }

  resultWrap.classList.add('visible');
  resultWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─────────────────────────────────────────────────────────────
//  COPY / SHARE
// ─────────────────────────────────────────────────────────────
function copyResult() {
  if (!currentResult) return;
  const { words, emoji, tm } = currentResult;
  const text = '#' + words.join('') + (tm ? '™' : '') + emoji;
  navigator.clipboard.writeText(text).then(() => showToast('Copied: ' + text));
}

function copyShareText() {
  if (!currentResult) return;
  const { words, emoji, tm, attr } = currentResult;
  const name = '#' + words.join('') + (tm ? '™' : '') + emoji;
  const credit = tm ? ' [Rice]™' : (attr ? ` [${attr}]` : '');
  const text = `${name}${credit}\n\nGenerated at EmoBandName™ Generator — No Ads. No BS.`;
  navigator.clipboard.writeText(text).then(() => showToast('Share text copied'));
}

// Expose to HTML
window.copyResult = copyResult;
window.copyShareText = copyShareText;

// ─────────────────────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
