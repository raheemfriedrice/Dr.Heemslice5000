/* Part Time Villains — countdown to the next Sunday 22:22 America/Chicago,
 * plus a quiet starfield. No dependencies. Built by Rice + Claude.
 */
'use strict';

const $ = id => document.getElementById(id);

// Next Sunday 22:22 Central, computed in the viewer's own clock via the
// America/Chicago offset so it's correct from any timezone.
function chicagoOffsetMs(date) {
  // Offset (minutes) between local and America/Chicago at `date`.
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map(p => [p.type, p.value]));
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
  return asUTC - date.getTime(); // ms that Chicago wall-clock leads UTC-of-local
}

function nextDrop() {
  const now = new Date();
  // Build "today in Chicago" wall clock, then find the next Sunday 22:22.
  const off = chicagoOffsetMs(now);
  const chi = new Date(now.getTime() + off); // a Date whose UTC fields read as Chicago wall time
  let day = chi.getUTCDay();          // 0 = Sunday
  let target = new Date(Date.UTC(chi.getUTCFullYear(), chi.getUTCMonth(), chi.getUTCDate(), 22, 22, 0));
  // days until Sunday
  let addDays = (7 - day) % 7;
  if (day === 0 && chi.getUTCHours() * 60 + chi.getUTCMinutes() >= 22 * 60 + 22 + 60) addDays = 7; // past the 1-hr window → next week
  target.setUTCDate(target.getUTCDate() + addDays);
  // target is Chicago wall time expressed in UTC fields; convert to real instant
  const realUTC = target.getTime() - chicagoOffsetMs(new Date(target.getTime() - off));
  return realUTC;
}

let dropTime = nextDrop();

function tick() {
  const now = Date.now();
  let diff = dropTime - now;
  const WINDOW = 60 * 60 * 1000; // 1-hour live window after 22:22
  if (diff <= 0 && now - dropTime < WINDOW) {
    $('clock').hidden = true; $('live').hidden = false;
  } else {
    if (diff <= 0) { dropTime = nextDrop(); diff = dropTime - now; }
    $('clock').hidden = false; $('live').hidden = true;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    $('d').textContent = d;
    $('h').textContent = String(h).padStart(2, '0');
    $('m').textContent = String(m).padStart(2, '0');
    $('s').textContent = String(s).padStart(2, '0');
  }
  try {
    const loc = new Date(dropTime).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
    $('local').textContent = 'That\'s ' + loc + ' your time.';
  } catch (_) {}
}
setInterval(tick, 1000); tick();

// ── Starfield ──
const cv = $('bg'), g = cv.getContext('2d');
let stars = [], W = 0, Hh = 0;
function resize() {
  W = cv.width = innerWidth; Hh = cv.height = innerHeight;
  stars = Array.from({ length: Math.min(140, (W * Hh) / 9000) | 0 }, () => ({
    x: Math.random() * W, y: Math.random() * Hh, z: Math.random() * 0.8 + 0.2, t: Math.random() * 6.28,
  }));
}
addEventListener('resize', resize); resize();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function star() {
  g.clearRect(0, 0, W, Hh);
  for (const s of stars) {
    s.t += 0.02 * s.z;
    if (!reduce) s.y += s.z * 0.15;
    if (s.y > Hh) s.y = 0;
    const a = 0.3 + Math.sin(s.t) * 0.3 + 0.3;
    g.globalAlpha = a * s.z;
    g.fillStyle = s.z > 0.7 ? '#9e90fc' : '#ffffff';
    g.fillRect(s.x, s.y, s.z < 0.5 ? 1 : 2, s.z < 0.5 ? 1 : 2);
  }
  g.globalAlpha = 1;
  requestAnimationFrame(star);
}
requestAnimationFrame(star);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
