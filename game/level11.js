/* LEVEL 11 — CVD's Grind Realm.  Winner Winner × The Dream Keeper's Secret.
 * CVD: 2 HP behind a shield that only drops during attack recovery.
 * Players: full HP, but the ONLY thing that can touch CVD is a dash.
 * Attacks are telegraphed. No tricks, no RNG cheap shots. Timing only.
 * Built by Rice + Claude. Pixel art, no dependencies.
 */
'use strict';

const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
const W = 320, H = 480;
ctx.imageSmoothingEnabled = false;

// Scale canvas to the viewport, integer where possible.
function fit() {
  const pad = 8;
  const s = Math.max(1, Math.min((innerWidth - pad) / W, (innerHeight - pad) / H));
  cvs.style.width = Math.floor(W * s) + 'px';
  cvs.style.height = Math.floor(H * s) + 'px';
}
addEventListener('resize', fit); fit();

const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const TAU = Math.PI * 2;

// CVD's lines — in character, needling, never cheap.
const CVD_HIT = ["ouch. say it counts.", "one. that was real.", "touché. literally.", "fine. that one landed."];
const CVD_MISS = ["too agreeable.", "that's a reflex, not a hit.", "the grind doesn't tip.", "no trick gets through.", "you looked the wrong way.", "wait for the window."];
const CVD_WIN = ["grind's still standing.", "come back when you mean it.", "2 HP. you got zero.", "the floor holds."];
const CVD_LOSE = ["two L's make a W. go.", "earned. not lucky.", "you read the floor. respect.", "the room opens. go up."];
const CVD_OPEN = ["no tricks. just timing.", "i control the approach.", "hit me when the shield blinks.", "i'm the grind, not the enemy."];

let state = 'menu', numP = 1, assist = false, cheatUsed = false;

// ── Entities ─────────────────────────────────────────────────
const P_COLORS = ['#5ef2c8', '#ffd36b', '#ff5b86', '#9e90fc'];
function makePlayers(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      x: W / 2 + (i - (n - 1) / 2) * 34, y: H - 70,
      vx: 0, vy: 0, r: 7, hp: 3, color: P_COLORS[i], id: i,
      dash: 0, dashCd: 0, dashX: 0, dashY: -1, inv: 0, hitFlash: 0, dead: false,
      ai: false,
    });
  }
  return arr;
}

const cvd = {
  x: W / 2, y: 150, r: 15, hp: 2,
  shield: true, shieldAlpha: 1,
  phase: 'idle', t: 0, next: 70,
  attack: null, bob: 0, hurt: 0, deathT: 0,
};
let projectiles = [], beams = [], rings = [], particles = [], floaters = [];
let players = [];
let shakeT = 0, winGlow = 0;

function reset() {
  players = makePlayers(numP);
  cvd.hp = 2; cvd.x = W / 2; cvd.y = 150; cvd.shield = true; cvd.shieldAlpha = 1;
  cvd.phase = 'idle'; cvd.t = 0; cvd.next = 60; cvd.attack = null; cvd.hurt = 0; cvd.deathT = 0;
  projectiles = []; beams = []; rings = []; particles = []; floaters = [];
  shakeT = 0; winGlow = 0; cheatUsed = false;
  say(CVD_OPEN[(Math.random() * CVD_OPEN.length) | 0]);
}

// ── Floating CVD speech on the canvas ────────────────────────
let sayText = '', sayT = 0;
function say(s) { sayText = s; sayT = 150; }

// ── Input ────────────────────────────────────────────────────
const keys = {};
addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) e.preventDefault();
  if (e.key === ' ' || e.key === 'Shift') tryDash(players[0]);
});
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

// Touch: left half = virtual stick for player 0, right-half tap = dash.
let stick = null;
cvs.addEventListener('touchstart', e => {
  e.preventDefault();
  for (const t of e.changedTouches) {
    const p = canvasPos(t);
    if (p.x < W / 2) stick = { id: t.identifier, ox: p.x, oy: p.y, x: p.x, y: p.y };
    else tryDash(players[0]);
  }
}, { passive: false });
cvs.addEventListener('touchmove', e => {
  e.preventDefault();
  for (const t of e.changedTouches) if (stick && t.identifier === stick.id) {
    const p = canvasPos(t); stick.x = p.x; stick.y = p.y;
  }
}, { passive: false });
cvs.addEventListener('touchend', e => {
  e.preventDefault();
  for (const t of e.changedTouches) if (stick && t.identifier === stick.id) stick = null;
}, { passive: false });
function canvasPos(t) {
  const r = cvs.getBoundingClientRect();
  return { x: (t.clientX - r.left) / r.width * W, y: (t.clientY - r.top) / r.height * H };
}

function tryDash(p) {
  if (!p || p.dead || state !== 'play' || p.dashCd > 0 || p.dash > 0) return;
  let dx = 0, dy = 0;
  if (keys['arrowleft'] || keys['a']) dx -= 1;
  if (keys['arrowright'] || keys['d']) dx += 1;
  if (keys['arrowup'] || keys['w']) dy -= 1;
  if (keys['arrowdown'] || keys['s']) dy += 1;
  if (stick) { dx = stick.x - stick.ox; dy = stick.y - stick.oy; }
  if (dx === 0 && dy === 0) { dx = cvd.x - p.x; dy = cvd.y - p.y; }
  const m = Math.hypot(dx, dy) || 1;
  p.dashX = dx / m; p.dashY = dy / m;
  p.dash = 13; p.dashCd = 34; p.inv = 13;
  for (let i = 0; i < 8; i++) particles.push(spark(p.x, p.y, p.color));
}

function spark(x, y, c) {
  return { x, y, vx: rand(-2, 2), vy: rand(-2, 2), life: rand(14, 26), c, r: rand(1, 3) };
}

// ── Simple AI for extra players & assist-run allies ──────────
function aiControl(p) {
  // Dodge nearest threat; dash when shield is down and lined up.
  let threat = null, td = 1e9;
  for (const pr of projectiles) { const d = dist(p.x, p.y, pr.x, pr.y); if (d < td) { td = d; threat = pr; } }
  let mvx = 0, mvy = 0;
  if (threat && td < 60) { mvx = p.x - threat.x; mvy = p.y - threat.y; }
  else { // orbit the boss
    const ang = Math.atan2(p.y - cvd.y, p.x - cvd.x) + 0.04;
    const tx = cvd.x + Math.cos(ang) * 95, ty = cvd.y + Math.sin(ang) * 95;
    mvx = tx - p.x; mvy = ty - p.y;
  }
  const m = Math.hypot(mvx, mvy) || 1;
  p.vx += (mvx / m) * 0.5; p.vy += (mvy / m) * 0.5;
  if (!cvd.shield && cvd.hp > 0 && p.dashCd <= 0 && dist(p.x, p.y, cvd.x, cvd.y) < 120 && Math.random() < 0.5) {
    sticklessDash(p);
  }
}
function sticklessDash(p) {
  const dx = cvd.x - p.x, dy = cvd.y - p.y, m = Math.hypot(dx, dy) || 1;
  p.dashX = dx / m; p.dashY = dy / m; p.dash = 13; p.dashCd = 34; p.inv = 13;
}

// ── CVD attack patterns (all telegraphed) ────────────────────
// Returns {warn, fire} timings. Shield drops during 'recover'.
const PATTERNS = ['spread', 'aim', 'ring', 'sweep'];
function startAttack() {
  const name = PATTERNS[(Math.random() * PATTERNS.length) | 0];
  cvd.attack = { name, warn: 42, fireT: 0, fired: false };
  cvd.phase = 'warn';
  cvd.t = 0;
}
function fireAttack() {
  const a = cvd.attack, tgt = nearestAlive();
  const spd = assist ? 2.6 : 2.2;
  if (a.name === 'spread') {
    for (let i = -2; i <= 2; i++) {
      const ang = Math.atan2((tgt ? tgt.y : H) - cvd.y, (tgt ? tgt.x : W / 2) - cvd.x) + i * 0.3;
      projectiles.push(proj(cvd.x, cvd.y, Math.cos(ang) * spd, Math.sin(ang) * spd));
    }
  } else if (a.name === 'aim') {
    for (let k = 0; k < 3; k++) {
      const ang = Math.atan2((tgt ? tgt.y : H) - cvd.y, (tgt ? tgt.x : W / 2) - cvd.x);
      projectiles.push(proj(cvd.x, cvd.y, Math.cos(ang) * (spd + k * 0.5), Math.sin(ang) * (spd + k * 0.5)));
    }
  } else if (a.name === 'ring') {
    const n = assist ? 16 : 12;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU + rand(-0.05, 0.05);
      projectiles.push(proj(cvd.x, cvd.y, Math.cos(ang) * spd, Math.sin(ang) * spd));
    }
  } else if (a.name === 'sweep') {
    rings.push({ x: cvd.x, y: cvd.y, r: 10, max: 260, spd: 3 });
  }
  shakeT = 8;
}
function proj(x, y, vx, vy) { return { x, y, vx, vy, r: 4, life: 300 }; }
function nearestAlive() {
  let b = null, bd = 1e9;
  for (const p of players) if (!p.dead) { const d = dist(p.x, p.y, cvd.x, cvd.y); if (d < bd) { bd = d; b = p; } }
  return b;
}
function anyAlive() { return players.some(p => !p.dead); }

// ── Hit CVD ──────────────────────────────────────────────────
function damageCvd(by) {
  if (cvd.hp <= 0) return;
  cvd.hp--; cvd.hurt = 20; shakeT = 12;
  floaters.push({ x: cvd.x, y: cvd.y - 20, t: 70, txt: CVD_HIT[(Math.random() * CVD_HIT.length) | 0], c: by.color });
  for (let i = 0; i < 20; i++) particles.push(spark(cvd.x, cvd.y, '#fff'));
  if (cvd.hp <= 0) { cvd.phase = 'dying'; cvd.deathT = 0; say(CVD_LOSE[(Math.random() * CVD_LOSE.length) | 0]); }
  else { say("one down. one left."); cvd.phase = 'idle'; cvd.t = 0; cvd.next = 40; cvd.shield = true; }
}

// ── Update ───────────────────────────────────────────────────
function update() {
  if (state !== 'play') return;
  cvd.bob += 0.05;

  // Players
  players.forEach((p, i) => {
    if (p.dead) return;
    if (p.ai) aiControl(p);
    else if (i === 0) {
      let mx = 0, my = 0;
      if (keys['arrowleft'] || keys['a']) mx -= 1;
      if (keys['arrowright'] || keys['d']) mx += 1;
      if (keys['arrowup'] || keys['w']) my -= 1;
      if (keys['arrowdown'] || keys['s']) my += 1;
      if (stick) {
        const dx = stick.x - stick.ox, dy = stick.y - stick.oy, m = Math.hypot(dx, dy);
        if (m > 6) { mx = dx / Math.max(m, 30); my = dy / Math.max(m, 30); }
      }
      p.vx += mx * 0.7; p.vy += my * 0.7;
    }
    if (p.dash > 0) { p.x += p.dashX * 6.4; p.y += p.dashY * 6.4; p.dash--; }
    else { p.x += p.vx; p.y += p.vy; }
    p.vx *= 0.82; p.vy *= 0.82;
    p.x = clamp(p.x, 10, W - 10); p.y = clamp(p.y, 44, H - 10);
    if (p.dashCd > 0) p.dashCd--;
    if (p.inv > 0) p.inv--;
    if (p.hitFlash > 0) p.hitFlash--;

    // Dash lands on CVD only when shield is down.
    if (p.dash > 0 && cvd.hp > 0 && dist(p.x, p.y, cvd.x, cvd.y) < cvd.r + p.r + 2) {
      if (!cvd.shield) { damageCvd(p); p.dash = 0; p.dashX = -p.dashX; p.dashY = -p.dashY; }
      else { // bounced off the shield
        p.vx = -p.dashX * 3; p.vy = -p.dashY * 3; p.dash = 0;
        rings.push({ x: cvd.x, y: cvd.y, r: cvd.r, max: cvd.r + 18, spd: 2, ring: true });
        if (Math.random() < 0.5) say(CVD_MISS[(Math.random() * CVD_MISS.length) | 0]);
      }
    }
  });

  // CVD state machine
  if (cvd.phase === 'idle') {
    cvd.shield = true; cvd.shieldAlpha += (1 - cvd.shieldAlpha) * 0.2;
    // drift toward center of the floor, slow menacing float
    cvd.x += Math.sin(cvd.bob) * 0.4;
    cvd.t++;
    if (cvd.t > cvd.next) startAttack();
  } else if (cvd.phase === 'warn') {
    cvd.shield = true; cvd.t++;
    if (cvd.t >= cvd.attack.warn) { fireAttack(); cvd.phase = 'recover'; cvd.t = 0; }
  } else if (cvd.phase === 'recover') {
    // SHIELD DOWN — the window.
    cvd.shield = false; cvd.shieldAlpha += (0 - cvd.shieldAlpha) * 0.3;
    cvd.t++;
    const win = assist ? 34 : 46;
    if (cvd.t >= win) { cvd.phase = 'idle'; cvd.t = 0; cvd.next = assist ? rand(40, 70) : rand(55, 90); }
  } else if (cvd.phase === 'dying') {
    cvd.deathT++;
    if (cvd.deathT % 3 === 0) for (let i = 0; i < 6; i++) particles.push(spark(cvd.x + rand(-12, 12), cvd.y + rand(-12, 12), '#9e90fc'));
    if (cvd.deathT > 90) return endGame(true);
  }
  if (cvd.hurt > 0) cvd.hurt--;

  // Projectiles
  projectiles = projectiles.filter(pr => {
    pr.x += pr.vx; pr.y += pr.vy; pr.life--;
    for (const p of players) if (!p.dead && p.inv <= 0 && dist(p.x, p.y, pr.x, pr.y) < p.r + pr.r) {
      hurtPlayer(p); return false;
    }
    return pr.life > 0 && pr.x > -20 && pr.x < W + 20 && pr.y > -20 && pr.y < H + 20;
  });
  // Sweep rings
  rings = rings.filter(r => {
    r.r += r.spd;
    if (!r.ring) for (const p of players) if (!p.dead && p.inv <= 0 && Math.abs(dist(p.x, p.y, r.x, r.y) - r.r) < 7) hurtPlayer(p);
    return r.r < (r.max || 300);
  });
  // Particles / floaters
  particles = particles.filter(s => { s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.life--; return s.life > 0; });
  floaters = floaters.filter(f => { f.y -= 0.5; f.t--; return f.t > 0; });
  if (shakeT > 0) shakeT--;
  if (sayT > 0) sayT--;
  if (winGlow > 0) winGlow--;

  if (!anyAlive()) endGame(false);
}

function hurtPlayer(p) {
  p.hp--; p.inv = 60; p.hitFlash = 10; shakeT = 6;
  for (let i = 0; i < 10; i++) particles.push(spark(p.x, p.y, p.color));
  if (p.hp <= 0) { p.dead = true; for (let i = 0; i < 18; i++) particles.push(spark(p.x, p.y, '#555')); }
}

// ── Render ───────────────────────────────────────────────────
function draw() {
  ctx.save();
  if (shakeT > 0) ctx.translate(rand(-3, 3), rand(-3, 3));
  // bg
  ctx.fillStyle = '#070510'; ctx.fillRect(-4, -4, W + 8, H + 8);
  drawStainedGlass();

  if (state === 'play' || state === 'result') {
    rings.forEach(r => {
      ctx.strokeStyle = r.ring ? 'rgba(158,144,252,.6)' : 'rgba(255,91,134,.5)';
      ctx.lineWidth = r.ring ? 2 : 4;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke();
    });
    projectiles.forEach(pr => {
      ctx.fillStyle = '#ff5b86'; px(pr.x - 2, pr.y - 2, 4, 4);
      ctx.fillStyle = '#ffd36b'; px(pr.x - 1, pr.y - 1, 2, 2);
    });
    drawCvd();
    players.forEach(p => { if (!p.dead) drawPlayer(p); });
    particles.forEach(s => { ctx.globalAlpha = clamp(s.life / 20, 0, 1); ctx.fillStyle = s.c; px(s.x, s.y, s.r, s.r); });
    ctx.globalAlpha = 1;
    floaters.forEach(f => {
      ctx.globalAlpha = clamp(f.t / 70, 0, 1); ctx.fillStyle = f.c; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
      ctx.fillText(f.txt, f.x, f.y); ctx.globalAlpha = 1;
    });
    drawHud();
  }
  ctx.restore();
}

function drawStainedGlass() {
  // Direction-memory fracture: faint panes that tint by run.
  ctx.globalAlpha = 0.14;
  const cols = ['#9e90fc', '#5ef2c8', '#ffd36b', '#ff5b86'];
  for (let gy = 0; gy < 6; gy++) for (let gx = 0; gx < 4; gx++) {
    ctx.fillStyle = cols[(gx + gy + (cheatUsed ? 2 : 0)) % cols.length];
    px(gx * 80 + 2, gy * 80 + 2, 76, 76);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 2;
  for (let gx = 0; gx <= 4; gx++) { ctx.beginPath(); ctx.moveTo(gx * 80, 0); ctx.lineTo(gx * 80, H); ctx.stroke(); }
  for (let gy = 0; gy <= 6; gy++) { ctx.beginPath(); ctx.moveTo(0, gy * 80); ctx.lineTo(W, gy * 80); ctx.stroke(); }
}

function drawCvd() {
  if (cvd.hp <= 0 && cvd.phase === 'dying') ctx.globalAlpha = clamp(1 - cvd.deathT / 90, 0, 1);
  const x = Math.round(cvd.x), y = Math.round(cvd.y + Math.sin(cvd.bob) * 3);
  // body — a pixel "room" / detective silhouette (CVD)
  const body = cvd.hurt > 0 && cvd.hurt % 4 < 2 ? '#fff' : '#1b1733';
  ctx.fillStyle = body; px(x - 12, y - 12, 24, 24);
  ctx.fillStyle = '#9e90fc'; px(x - 12, y - 14, 24, 4); // brim
  px(x - 14, y - 12, 28, 2);
  ctx.fillStyle = cvd.phase === 'warn' ? '#ff5b86' : '#5ef2c8'; // eye
  const eo = cvd.phase === 'warn' && (cvd.t % 8 < 4) ? '#ffd36b' : (cvd.phase === 'warn' ? '#ff5b86' : '#5ef2c8');
  ctx.fillStyle = eo; px(x - 6, y - 4, 4, 4); px(x + 2, y - 4, 4, 4);
  ctx.fillStyle = '#7a7498'; px(x - 6, y + 6, 12, 2); // mouth line
  // shield
  if (cvd.shieldAlpha > 0.02) {
    ctx.globalAlpha = cvd.shieldAlpha * 0.9;
    ctx.strokeStyle = cvd.phase === 'recover' ? '#ff5b86' : '#9e90fc';
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, cvd.r + 7, 0, TAU); ctx.stroke();
    ctx.globalAlpha = cvd.shieldAlpha * 0.25; ctx.fillStyle = '#9e90fc';
    ctx.beginPath(); ctx.arc(x, y, cvd.r + 7, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 1;
}

function drawPlayer(p) {
  const x = Math.round(p.x), y = Math.round(p.y);
  if (p.inv > 0 && p.inv % 6 < 3 && p.dash <= 0) return; // i-frame blink
  if (p.dash > 0) { ctx.globalAlpha = 0.4; ctx.fillStyle = p.color; px(x - p.dashX * 6 - 4, y - p.dashY * 6 - 4, 8, 8); ctx.globalAlpha = 1; }
  ctx.fillStyle = p.hitFlash > 0 ? '#fff' : p.color;
  px(x - 5, y - 5, 10, 10);
  ctx.fillStyle = '#070510'; px(x - 3, y - 2, 2, 2); px(x + 1, y - 2, 2, 2);
  // dash-ready pip
  ctx.fillStyle = p.dashCd <= 0 ? '#fff' : '#4a4466'; px(x - 1, y - 9, 2, 2);
}

function drawHud() {
  // CVD HP (2 pips + shield word)
  ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
  ctx.fillStyle = '#9e90fc'; ctx.fillText('CVD', 8, 14);
  for (let i = 0; i < 2; i++) { ctx.fillStyle = i < cvd.hp ? '#ff5b86' : '#2a2450'; px(40 + i * 12, 6, 9, 9); }
  ctx.fillStyle = cvd.shield ? '#5ef2c8' : '#ffd36b'; ctx.textAlign = 'right';
  ctx.fillText(cvd.shield ? 'SHIELD UP' : 'SHIELD DOWN — HIT NOW', W - 8, 14);
  // Player HP
  ctx.textAlign = 'left';
  players.forEach((p, i) => {
    const bx = 8 + i * 58;
    ctx.fillStyle = p.color; ctx.fillText('P' + (i + 1), bx, H - 8);
    for (let h = 0; h < 3; h++) { ctx.fillStyle = (!p.dead && h < p.hp) ? p.color : '#2a2450'; px(bx + 20 + h * 8, H - 16, 6, 6); }
  });
  // say
  if (sayT > 0 && sayText) {
    ctx.globalAlpha = clamp(sayT / 40, 0, 1);
    ctx.fillStyle = '#ffd36b'; ctx.font = 'italic 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText('CVD: ' + sayText, W / 2, 30);
    ctx.globalAlpha = 1;
  }
  if (assist) { ctx.fillStyle = '#ff5b86'; ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.fillText('AI-ASSIST · harder · eclipse locked if you cheat', W / 2, H - 28); }
}

function px(x, y, w, h) { ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

// ── Loop ─────────────────────────────────────────────────────
let last = 0, acc = 0;
function loop(ts) {
  const dt = Math.min(50, ts - last); last = ts; acc += dt;
  while (acc >= 16.67) { update(); acc -= 16.67; }
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ── Flow ─────────────────────────────────────────────────────
function endGame(won) {
  state = 'result';
  $('result-title').innerHTML = won ? 'FLOOR <b style="color:#5ef2c8">CLEARED</b>' : '<span style="color:#ff5b86">THE GRIND HOLDS</span>';
  $('result-title').style.color = '#c9c1ff';
  $('result-body').textContent = won
    ? "You touched CVD twice, clean, through the window. No trick, no luck. Level 11 opens. In the real game this is where you climb toward 22 — and remember, to truly win you have to lose twice. That part comes later."
    : "CVD still has HP. The shield only drops for a beat after each attack — dodge, wait for 'SHIELD DOWN', then dash in. You're not fighting strength. You're fighting timing.";
  $('result-say').textContent = 'CVD: ' + (won ? CVD_LOSE : CVD_WIN)[0];
  show('result');
}

function begin(isAssist) {
  assist = isAssist; state = 'play';
  for (let i = 1; i < players.length; i++) { } // placeholder
  reset();
  // Extra local players beyond P1 are AI allies (one device, up to 4).
  players.forEach((p, i) => { if (i > 0) p.ai = true; });
  hideAll();
}

function show(id) { hideAll(); $(id).hidden = false; }
function hideAll() { ['menu', 'howto', 'result'].forEach(x => $(x).hidden = true); }

// Buttons
$('players').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  numP = +b.dataset.p;
  [...$('players').children].forEach(x => x.classList.toggle('on', x === b));
  $('menu-say').textContent = numP > 1 ? "CVD: extra players ride as allies — but they don't help you aim." : '';
});
$('start').onclick = () => { players = makePlayers(numP); begin(false); };
$('assist').onclick = () => { players = makePlayers(numP); begin(true); };
$('how').onclick = () => show('howto');
$('howback').onclick = () => show('menu');
$('again').onclick = () => { players = makePlayers(numP); begin(assist); };
$('menu2').onclick = () => { state = 'menu'; show('menu'); };

// Secret: typing "cheat" locks the eclipse ending (honors the canon rule).
let buf = '';
addEventListener('keydown', e => {
  buf = (buf + e.key).slice(-5).toLowerCase();
  if (buf === 'cheat' && state === 'play') { cheatUsed = true; cvd.hp = 1; say('cheat used. eclipse ending locked. your save knows.'); }
});
