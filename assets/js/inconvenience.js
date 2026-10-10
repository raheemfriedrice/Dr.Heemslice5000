const COOLDOWN_MS    = (22 * 60 + 22) * 60 * 1000;
const LIFETIME_BASE  = 48.36;
const SK_FIST  = 'tis_fistbumped';
const SK_ORDER = 'tis_lastOrder';
const SK_TOTAL = 'tis_lifetimeTotal';
const SK_CLICK = 'tis_dontClicks';

const PRODUCTS = {
  'ugly-rock':          { name: '#uglyrock$2™',             price: 2.00,  ship: 22.22 },
  'clamshell-scissors': { name: 'Premium Scissors™',        price: 14.99, ship: 22.22 },
  'battery-pack':       { name: 'Varietal Battery Pack™',   price: 6.00,  ship: 22.22 },
  'junk-drawer':        { name: 'Junk Drawer Starter Kit™', price: 11.00, ship: 22.22 },
};

const LANGS = [
  { label:'Standard English',   announce:'<strong>SHIPPING IS $22.22+TAX.</strong> &nbsp;|&nbsp; No free shipping. No free returns. No apologies. &nbsp;|&nbsp; Rice will <strong>not</strong> say thank you. Disclosed. Intentional. &nbsp;|&nbsp; <a href="#featured">Don\'t buy the rock.</a>', tagline:"We'd rather you didn't.", heroTitle:'SHOP.<br/><em>IF YOU</em><br/>MUST.', heroSub:'Slightly useful items. Barely annoying. If given as a gift, it would be almost insulted to not film the reaction.', cta1:"View the Rock (Don't)", cta2:'Other Stuff' },
  { label:'British English',     announce:'<strong>POSTAGE IS £22.22+VAT.</strong> &nbsp;|&nbsp; Quite appalling, really. Rice shan\'t say cheers. &nbsp;|&nbsp; <a href="#featured">Don\'t buy the bloody rock.</a>', tagline:"We'd rather you didn't. Honestly.", heroTitle:'SHOP.<br/><em>IF YOU</em><br/>MUST.', heroSub:"Marginally useful. Frightfully annoying. A terrible gift, though film the reaction regardless.", cta1:"View the Rock (Don't)", cta2:"Other Tat" },
  { label:'Pirate Mode',         announce:'<strong>SHIPPING BE $22.22+TAXES, LANDLUBBER.</strong> &nbsp;|&nbsp; Rice won\'t be saying thankee. Arrr. &nbsp;|&nbsp; <a href="#featured">Don\'t ye touch that rock.</a>', tagline:"We'd rather ye sailed elsewhere, arrr.", heroTitle:'SHOP.<br/><em>IF YE</em><br/>DARE.', heroSub:"A fine haul of barely useful plunder. Rice won't be offering thanks neither. Arrr.", cta1:"Eye the Rock (Arrr Don't)", cta2:"Other Plunder" },
  { label:'Corporate Speak',     announce:'<strong>LOGISTICAL SOLUTIONS: $22.22+TAX.</strong> &nbsp;|&nbsp; Verbal acknowledgment of gratitude is not in scope. &nbsp;|&nbsp; <a href="#featured">Leverage the rock offering.</a>', tagline:'We are not aligned with your purchasing objectives.', heroTitle:'ACQUIRE.<br/><em>IF BUSINESS</em><br/>CASE EXISTS.', heroSub:'Synergistic product offerings with minimal utility. Rice is not a stakeholder in your satisfaction journey.', cta1:'Evaluate Rock ROI', cta2:'Other Deliverables' },
  { label:'Text Speak',          announce:'<strong>SHIPPING $22.22+TAX NGL.</strong> &nbsp;|&nbsp; rice is NOT saying ty lmao. &nbsp;|&nbsp; <a href="#featured">don\'t even buy the rock tbh</a>', tagline:"idk why ur here tbh", heroTitle:'SHOP.<br/><em>I MEAN</em><br/>IDK.', heroSub:'stuff that kinda works? barely annoying. weird gift idea ngl lol', cta1:"See the Rock (don't lol)", cta2:"other stuff ig" },
  { label:'Extremely Tired',     announce:'<strong>shipping is $22.22+tax. just... $22.22.</strong> &nbsp;|&nbsp; rice isn\'t gonna thank you. &nbsp;|&nbsp; <a href="#featured">please don\'t buy the rock.</a>', tagline:"please just... don't.", heroTitle:'shop.<br/><em>if you</em><br/>have to.', heroSub:"things. they're slightly useful. barely annoying. please think about it first though.", cta1:"look at the rock (please don't)", cta2:"other things" },
  { label:'Español',             announce:'<strong>ENVÍO: $22.22+IMPUESTOS.</strong> &nbsp;|&nbsp; Rice no va a dar las gracias. &nbsp;|&nbsp; <a href="#featured">No compre la roca, por favor.</a>', tagline:"Preferiríamos que no.", heroTitle:'COMPRA.<br/><em>SI</em><br/>DEBES.', heroSub:'Productos ligeramente útiles. Apenas molestos. La tienda solo se vuelve más inconveniente.', cta1:"Ver la Roca (No)", cta2:"Otras Cosas" },
  { label:'Français',            announce:'<strong>LIVRAISON: $22.22+TAXES.</strong> &nbsp;|&nbsp; Rice ne dira pas merci. &nbsp;|&nbsp; <a href="#featured">N\'achetez pas le caillou.</a>', tagline:"Nous préférerions que vous ne le fassiez pas.", heroTitle:'ACHETEZ.<br/><em>SI VOUS</em><br/>DEVEZ.', heroSub:"Produits légèrement utiles. À peine ennuyeux. La boutique ne fera qu'empirer.", cta1:"Voir le Caillou (Non)", cta2:"Autres Choses" },
  { label:'Legal / Compliance',  announce:'<strong>SHIPPING FEE: $22.22 USD + APPLICABLE TAXES.</strong> &nbsp;|&nbsp; Verbal expressions of gratitude from Rice are expressly disclaimed. &nbsp;|&nbsp; <a href="#featured">Purchase of the rock constitutes acknowledgment of its disclosed condition.</a>', tagline:"The Store does not represent that your use case is supported.", heroTitle:'TRANSACT.<br/><em>AT YOUR</em><br/>RISK.', heroSub:"Products provided as-is. Slight utility is not warranted. Annoyance level is disclosed.", cta1:"Review Rock Disclosures", cta2:"Alternative SKUs" },
];

let cart = [], cartStep = 0, langIdx = 0, cdInterval = null;

// ── STORAGE HELPERS ──
function ss(k, v) { try { sessionStorage.setItem(k, v); } catch(e){} }
function sg(k)    { try { return sessionStorage.getItem(k); } catch(e){ return null; } }
function ls(k, v) { try { localStorage.setItem(k, v); } catch(e){} }
function lg(k)    { try { return localStorage.getItem(k); } catch(e){ return null; } }

// ── GATE ──
(function() {
  const gate = document.getElementById('gate');
  const btn  = document.getElementById('gate-btn');
  if (sg(SK_FIST)) { gate.hidden = true; return; }
  document.body.style.overflow = 'hidden';
  btn.addEventListener('click', () => {
    ss(SK_FIST, '1');
    gate.style.opacity = '0';
    setTimeout(() => { gate.hidden = true; document.body.style.overflow = ''; }, 400);
  });
})();

// ── LIFETIME ──
function getTotal() { const v = parseFloat(lg(SK_TOTAL)); return isNaN(v) ? LIFETIME_BASE : v; }
function setLifetime(n) {
  ls(SK_TOTAL, n.toFixed(2));
  document.getElementById('lifetime-num').textContent = '$' + n.toFixed(2);
  const pt = document.getElementById('partner-total');
  const ps = document.getElementById('partner-share');
  if (pt) pt.textContent = '$' + n.toFixed(2);
  if (ps) ps.textContent = '$' + (n * .33).toFixed(2);
}
setLifetime(getTotal());

// ── ROCK REVEAL ──
document.getElementById('reveal-btn').addEventListener('click', function() {
  document.getElementById('rock-cover').classList.add('hidden');
  this.textContent = 'Revealed. You were warned.';
  this.disabled = true; this.style.opacity = '.5';
});

// ── COOLDOWN ──
function isCooling() { const ts = parseInt(lg(SK_ORDER)||'0',10); return ts && Date.now()-ts < COOLDOWN_MS; }
function remaining() { const ts = parseInt(lg(SK_ORDER)||'0',10); if(!ts) return 0; return Math.max(0, COOLDOWN_MS-(Date.now()-ts)); }
function fmt(ms) {
  const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
function openCD() {
  const ov = document.getElementById('cd-ov');
  ov.classList.add('open');
  document.getElementById('cd-timer').textContent = fmt(remaining());
  cdInterval = setInterval(() => {
    const r = remaining();
    document.getElementById('cd-timer').textContent = fmt(r);
    if (r <= 0) { clearInterval(cdInterval); ov.classList.remove('open'); toast('Cooldown over. You may shop again. Please reconsider.'); }
  }, 1000);
}
document.getElementById('cd-close').addEventListener('click', () => {
  clearInterval(cdInterval);
  document.getElementById('cd-ov').classList.remove('open');
});

// ── TOAST ──
let toastTimer;
function toast(msg, dur=3200) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.textContent = msg;
  el.classList.add('on');
  toastTimer = setTimeout(() => el.classList.remove('on'), dur);
}

// ── CART ──
function subtotal() { return cart.reduce((s,i)=>(s+(i.price+i.ship)*i.qty),0); }
function addToCart(id) {
  if (isCooling()) { openCD(); return; }
  const p = PRODUCTS[id]; if (!p) return;
  const ex = cart.find(i=>i.id===id);
  if (ex) ex.qty++; else cart.push({id, qty:1, ...p});
  toast(`${p.name} added. You'll regret this.`);
  openCart();
}
function openCart() { cartStep=0; renderCart(); document.getElementById('cart-ov').classList.add('open'); }
function closeCart() { document.getElementById('cart-ov').classList.remove('open'); }

const STEPS = [
  { primary:'Proceed to Regret →', secondary:'Actually, Never Mind', warn:'', msg:'' },
  { primary:'Yes, I Still Want This', secondary:'Leave My Cart', warn:'Are you sure? The shipping is $22.22. Per item. This is real money.', msg:'You have been warned. The store will not apologize for the total. The total is what it is. This is The Inconvenience Store™.' },
  { primary:'Place Order (Final Answer)', secondary:'Abandon Cart (Smart)', warn:'Last chance. Genuinely.', msg:'This is your final warning. You are about to spend real money on this. Rice will not say thank you. A 22:22 cooldown begins after purchase. Disappointment is guaranteed. Proceed?' },
];

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const totalNum = document.getElementById('cart-total-num');
  const warnEl  = document.getElementById('cart-warn');
  const stepEl  = document.getElementById('cart-stepmsg');
  const pBtn    = document.getElementById('cart-primary');
  const sBtn    = document.getElementById('cart-secondary');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="font-family:\'Space Mono\',monospace;font-size:.7rem;color:#999;padding:1rem 0;">Your bag is empty. Consider keeping it that way.</p>';
    totalEl.hidden = true;
  } else {
    itemsEl.innerHTML = cart.map(i=>`<div class="ci"><span class="ci__name">${i.name} × ${i.qty}<br/><span style="font-size:.58rem;color:#999;">$${i.ship.toFixed(2)} shipping each</span></span><span class="ci__price">$${((i.price+i.ship)*i.qty).toFixed(2)}</span></div>`).join('');
    totalEl.hidden = false;
    totalNum.textContent = '$' + subtotal().toFixed(2);
  }
  const step = STEPS[Math.min(cartStep, 2)];
  warnEl.textContent  = step.warn;
  stepEl.textContent  = step.msg;
  stepEl.hidden       = !step.msg;
  pBtn.textContent    = step.primary;
  sBtn.textContent    = step.secondary;
}

document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-ov').addEventListener('click', e => { if (e.target.id==='cart-ov') closeCart(); });
document.getElementById('cart-secondary').addEventListener('click', () => {
  if (cartStep === 0 || !cart.length) { closeCart(); return; }
  cart = []; closeCart(); toast('Cart cleared. Good call.');
});
document.getElementById('cart-primary').addEventListener('click', () => {
  if (!cart.length) { closeCart(); return; }
  if (cartStep < 2) { cartStep++; renderCart(); }
  else confirmOrder();
});
document.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => addToCart(b.dataset.add)));

function confirmOrder() {
  const total = subtotal();
  closeCart();
  ls(SK_ORDER, Date.now().toString());
  setLifetime(getTotal() + total);
  cart = []; cartStep = 0;
  document.getElementById('confirm-msg').textContent = `Order total: $${total.toFixed(2)} — shipped at $22.22 per item. Rest-assured delays apply. Disappointment guaranteed. Rice has been notified. He put his fist to the screen. That is all.`;
  document.getElementById('confirm-ov').classList.add('open');
}
document.getElementById('confirm-close').addEventListener('click', () => {
  document.getElementById('confirm-ov').classList.remove('open');
});

// ── DONT CLICK ──
(function() {
  let clicks = parseInt(sg(SK_CLICK)||'0', 10);
  const btn = document.getElementById('dc-btn');
  const cnt = document.getElementById('dc-count');
  function upd() {
    if (!clicks) { cnt.textContent=''; return; }
    cnt.textContent = clicks===1
      ? "You clicked it. We noted it. We don't understand why."
      : `You've clicked it ${clicks} time${clicks>1?'s':''}. We still don't understand why. We have documented this.`;
  }
  btn.addEventListener('click', () => { clicks++; ss(SK_CLICK, clicks); upd(); });
  upd();
})();

// ── LANGUAGE ──
document.getElementById('lang-btn').addEventListener('click', () => {
  langIdx = (langIdx + 1) % LANGS.length;
  const l = LANGS[langIdx];
  document.getElementById('announce-text').innerHTML = l.announce;
  document.getElementById('nav-tagline').textContent = l.tagline;
  document.getElementById('hero-title').innerHTML    = l.heroTitle;
  document.getElementById('hero-sub').textContent    = l.heroSub;
  document.getElementById('hero-cta1').textContent   = l.cta1;
  document.getElementById('hero-cta2').textContent   = l.cta2;
  document.getElementById('lang-cur').textContent    = l.label;
});

// ── HOOKS FOR #BetItAll™ ──
window.TIS = {
  toast,
  cartCount: () => cart.reduce((n, i) => n + i.qty, 0),
  cartTotal: subtotal,
  clearCart() { cart = []; cartStep = 0; closeCart(); },
  startCooldown() { ls(SK_ORDER, Date.now().toString()); },
  waiveCooldown() {
    try { localStorage.removeItem(SK_ORDER); } catch (e) {}
    clearInterval(cdInterval);
    document.getElementById('cd-ov').classList.remove('open');
  },
};

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeCart();
  clearInterval(cdInterval);
  document.getElementById('cd-ov').classList.remove('open');
  document.getElementById('confirm-ov').classList.remove('open');
});
