/* ================================================================
   The Inconvenience Store™ — inconvenience.js
   Built by Rice + Claude. Brightskin Bible Compliant.
   ================================================================ */

const COOLDOWN_MS    = (22 * 60 + 22) * 60 * 1000;
const LIFETIME_BASE  = 48.36;
const STORAGE_FIST   = 'tis_fistbumped';
const STORAGE_ORDER  = 'tis_lastOrder';
const STORAGE_TOTAL  = 'tis_lifetimeTotal';
const STORAGE_CLICKS = 'tis_dontClicks';

const PRODUCTS = {
  'ugly-rock':         { name: '#uglyrock$2™',               price: 2.00,  shipping: 22.22 },
  'clamshell-scissors':{ name: 'Premium Scissors™',          price: 14.99, shipping: 22.22 },
  'battery-pack':      { name: 'Varietal Battery Pack™',     price: 6.00,  shipping: 22.22 },
  'junk-drawer':       { name: 'Junk Drawer Starter Kit™',   price: 11.00, shipping: 22.22 },
};

const LANGUAGES = [
  {
    key: 'en',
    label: 'Standard English',
    announce: '<strong>SHIPPING IS $22.22+TAX.</strong> &nbsp;|&nbsp; No free shipping. No free returns. No apologies. &nbsp;|&nbsp; Rice will <strong>not</strong> say thank you. Disclosed. Intentional. &nbsp;|&nbsp; <a href="#featured">Don\'t buy the rock.</a> &nbsp;|&nbsp; Store gets more inconvenient from here.',
    tagline: "We'd rather you didn't.",
    heroTitle: 'SHOP.<br/><em>IF YOU</em><br/>MUST.',
    heroSub: 'Slightly useful items. Barely annoying. If given as a gift, it would be almost insulted to not film the reaction. Absurdity of purchase confirmed.',
    cta1: 'View the Rock (Don\'t)',
    cta2: 'Other Stuff',
  },
  {
    key: 'brit',
    label: 'British English',
    announce: '<strong>POSTAGE IS £22.22+VAT.</strong> &nbsp;|&nbsp; Quite appalling, really. Rice shan\'t say cheers. You\'ve been warned. &nbsp;|&nbsp; <a href="#featured">Don\'t buy the bloody rock.</a>',
    tagline: "We'd rather you didn't. Honestly.",
    heroTitle: 'SHOP.<br/><em>IF YOU</em><br/>MUST.',
    heroSub: 'Marginally useful. Frightfully annoying. A terrible gift, though film the reaction regardless. The store shall only get more inconvenient.',
    cta1: "View the Rock (Don't)",
    cta2: "Other Tat",
  },
  {
    key: 'pirate',
    label: 'Pirate Mode',
    announce: '<strong>SHIPPING BE $22.22+TAXES, LANDLUBBER.</strong> &nbsp;|&nbsp; Rice won\'t be saying "thankee" — ye\'ve been warned, arrr. &nbsp;|&nbsp; <a href="#featured">Don\'t ye touch that rock.</a>',
    tagline: "We'd rather ye sailed elsewhere, arrr.",
    heroTitle: 'SHOP.<br/><em>IF YE</em><br/>DARE.',
    heroSub: "A fine haul of barely useful plunder. Ship it ye will, at great cost. Rice won't be offering thanks neither. Arrr.",
    cta1: "Eye the Rock (Arrr Don't)",
    cta2: "Other Plunder",
  },
  {
    key: 'corp',
    label: 'Corporate Speak',
    announce: '<strong>LOGISTICAL SOLUTIONS: $22.22+TAX.</strong> &nbsp;|&nbsp; Verbal acknowledgment of gratitude is not in scope. &nbsp;|&nbsp; <a href="#featured">Leverage the rock offering.</a>',
    tagline: 'We are not aligned with your purchasing objectives.',
    heroTitle: 'ACQUIRE.<br/><em>IF BUSINESS</em><br/>CASE EXISTS.',
    heroSub: 'Synergistic product offerings with minimal utility. Disruptive shipping model. Rice is not a stakeholder in your satisfaction journey.',
    cta1: 'Evaluate Rock ROI',
    cta2: 'Other Deliverables',
  },
  {
    key: 'text',
    label: 'Text Speak',
    announce: '<strong>SHIPPING $22.22+TAX NGL.</strong> &nbsp;|&nbsp; rice is NOT saying ty lmao. disclosed. &nbsp;|&nbsp; <a href="#featured">don\'t even buy the rock tbh</a>',
    tagline: "idk why ur here tbh",
    heroTitle: 'SHOP.<br/><em>I MEAN</em><br/>IDK.',
    heroSub: 'stuff that kinda works? barely annoying. weird gift idea ngl. store only gets worse from here lol',
    cta1: "See the Rock (don't lol)",
    cta2: "other stuff ig",
  },
  {
    key: 'tired',
    label: 'Extremely Tired',
    announce: '<strong>shipping is $22.22+tax. just... $22.22.</strong> &nbsp;|&nbsp; rice isn\'t gonna thank you. he said so. &nbsp;|&nbsp; <a href="#featured">please don\'t buy the rock.</a>',
    tagline: "please just... don't.",
    heroTitle: 'shop.<br/><em>if you</em><br/>have to.',
    heroSub: "things. they're slightly useful. barely annoying. you can buy them. please think about it first though. please.",
    cta1: "look at the rock (please don't)",
    cta2: "other things",
  },
  {
    key: 'es',
    label: 'Español',
    announce: '<strong>ENVÍO: $22.22+IMPUESTOS.</strong> &nbsp;|&nbsp; Rice no va a dar las gracias. Lo sabe usted. &nbsp;|&nbsp; <a href="#featured">No compre la roca, por favor.</a>',
    tagline: "Preferiríamos que no.",
    heroTitle: 'COMPRA.<br/><em>SI</em><br/>DEBES.',
    heroSub: 'Productos ligeramente útiles. Apenas molestos. Irónicamente disponibles. La tienda solo se vuelve más inconveniente a partir de ahora.',
    cta1: "Ver la Roca (No)",
    cta2: "Otras Cosas",
  },
  {
    key: 'fr',
    label: 'Français',
    announce: '<strong>LIVRAISON: $22.22+TAXES.</strong> &nbsp;|&nbsp; Rice ne dira pas merci. C\'est divulgué. &nbsp;|&nbsp; <a href="#featured">N\'achetez pas le caillou, s\'il vous plaît.</a>',
    tagline: "Nous préférerions que vous ne le fassiez pas.",
    heroTitle: 'ACHETEZ.<br/><em>SI VOUS</em><br/>DEVEZ.',
    heroSub: "Produits légèrement utiles. À peine ennuyeux. Disponibles sans ironie. La boutique ne fera qu'empirer à partir d'ici.",
    cta1: "Voir le Caillou (Non)",
    cta2: "Autres Choses",
  },
  {
    key: 'legal',
    label: 'Legal / Compliance',
    announce: '<strong>SHIPPING FEE: $22.22 USD + APPLICABLE TAXES.</strong> &nbsp;|&nbsp; Verbal or written expressions of gratitude from Rice are expressly disclaimed. &nbsp;|&nbsp; <a href="#featured">Purchase of the rock constitutes acknowledgment of its disclosed condition.</a>',
    tagline: "The Store does not represent that your use case is supported.",
    heroTitle: 'TRANSACT.<br/><em>AT YOUR</em><br/>RISK.',
    heroSub: 'Products are provided as-is. Slight utility is not warranted. Annoyance level is disclosed. Filming of gift recipient reactions is at giftor\'s discretion.',
    cta1: "Review Rock Disclosures",
    cta2: "Alternative SKUs",
  },
];

let cart = [];
let cartStep = 0;
let langIndex = 0;
let cooldownInterval = null;

/* ── FISTBUMP GATE ── */
function initFistbumpGate() {
  const gate = document.getElementById('fistbump-gate');
  const btn  = document.getElementById('fistbump-btn');
  if (!gate || !btn) return;

  if (sessionStorage.getItem(STORAGE_FIST)) {
    gate.style.display = 'none';
    return;
  }

  gate.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  btn.addEventListener('click', () => {
    sessionStorage.setItem(STORAGE_FIST, '1');
    gate.style.transition = 'opacity 0.4s';
    gate.style.opacity = '0';
    setTimeout(() => {
      gate.style.display = 'none';
      document.body.style.overflow = '';
    }, 400);
  });
}

/* ── LIFETIME COUNTER ── */
function getLifetimeTotal() {
  const stored = parseFloat(localStorage.getItem(STORAGE_TOTAL));
  return isNaN(stored) ? LIFETIME_BASE : stored;
}

function initLifetimeCounter() {
  const el = document.getElementById('lifetime-num');
  if (el) el.textContent = '$' + getLifetimeTotal().toFixed(2);
  updatePartnerTotals();
}

function addToLifetime(amount) {
  const cur = getLifetimeTotal();
  const next = cur + amount;
  localStorage.setItem(STORAGE_TOTAL, next.toFixed(2));
  const el = document.getElementById('lifetime-num');
  if (el) el.textContent = '$' + next.toFixed(2);
  updatePartnerTotals();
}

function updatePartnerTotals() {
  const total = getLifetimeTotal();
  const pt = document.getElementById('partner-total');
  const ps = document.getElementById('partner-share');
  if (pt) pt.textContent = '$' + total.toFixed(2);
  if (ps) ps.textContent = '$' + (total * 0.33).toFixed(2);
}

/* ── ROCK REVEAL ── */
function bindRockReveal() {
  const btn       = document.getElementById('reveal-rock-btn');
  const container = document.getElementById('rock-container');
  const cover     = container && container.querySelector('.rock-cover');
  if (!btn || !cover) return;

  btn.addEventListener('click', () => {
    cover.classList.add('hidden');
    btn.textContent = 'Revealed. You were warned.';
    btn.disabled = true;
    btn.style.opacity = '0.5';
  });
}

/* ── COOLDOWN ── */
function isCoolingDown() {
  const ts = parseInt(localStorage.getItem(STORAGE_ORDER) || '0', 10);
  return ts && (Date.now() - ts < COOLDOWN_MS);
}

function remainingCooldown() {
  const ts = parseInt(localStorage.getItem(STORAGE_ORDER) || '0', 10);
  if (!ts) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - ts));
}

function formatCooldown(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function openCooldownModal() {
  const overlay = document.getElementById('cooldown-overlay');
  if (overlay) {
    overlay.classList.add('open');
    updateCooldownTimer();
    cooldownInterval = setInterval(() => {
      const rem = remainingCooldown();
      updateCooldownTimer();
      if (rem <= 0) {
        clearInterval(cooldownInterval);
        overlay.classList.remove('open');
        showToast("Cooldown over. You may shop again. Please reconsider.");
      }
    }, 1000);
  }
}

function updateCooldownTimer() {
  const el = document.getElementById('cooldown-timer');
  if (el) el.textContent = formatCooldown(remainingCooldown());
}

document.addEventListener('click', e => {
  if (e.target && e.target.id === 'cooldown-close') {
    clearInterval(cooldownInterval);
    document.getElementById('cooldown-overlay').classList.remove('open');
  }
});

/* ── CART ── */
function addToCart(productId) {
  if (isCoolingDown()) {
    openCooldownModal();
    return;
  }
  const product = PRODUCTS[productId];
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1, ...product });
  }

  showToast(`${product.name} added. You'll regret this.`);
  openCart();
}

function openCart() {
  cartStep = 0;
  renderCart();
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
}

function cartSubtotal() {
  return cart.reduce((sum, i) => sum + (i.price + i.shipping) * i.qty, 0);
}

const DISCOURAGEMENT_STEPS = [
  {
    primary: 'Proceed to Regret →',
    secondary: 'Actually, Never Mind',
    warning: '',
    stepMsg: '',
  },
  {
    primary: 'Yes, I Still Want This',
    secondary: 'Leave My Cart',
    warning: 'Are you sure? The shipping is $22.22. Per item. This is real money.',
    stepMsg: 'You have been warned. The store will not apologize for the total. The total is what it is. This is The Inconvenience Store™.',
  },
  {
    primary: 'Place Order (Final Answer)',
    secondary: 'Abandon Cart (Smart)',
    warning: 'Last chance. Genuinely.',
    stepMsg: 'This is your final warning. You are about to spend real money on this. Rice will not say thank you. Shipping is $22.22 per item. A 22:22 cooldown will begin after purchase. Disappointment is guaranteed. Proceed?',
  },
];

function renderCart() {
  const itemsEl   = document.querySelector('.cart-modal__items');
  const totalEl   = document.querySelector('.cart-modal__total');
  const warnEl    = document.querySelector('.cart-modal__warning');
  const stepEl    = document.querySelector('.cart-modal__step-msg');
  const primaryBtn   = document.getElementById('cart-primary');
  const secondaryBtn = document.getElementById('cart-secondary');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="font-family:\'Space Mono\',monospace;font-size:0.72rem;color:#999;padding:1rem 0;">Your bag is empty. Consider keeping it that way.</p>';
    totalEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <span class="cart-item__name">${i.name} × ${i.qty}<br/><span style="font-size:0.6rem;color:#999;">$${i.shipping.toFixed(2)} shipping each</span></span>
        <span class="cart-item__price">$${((i.price + i.shipping) * i.qty).toFixed(2)}</span>
      </div>
    `).join('');
    totalEl.style.display = 'flex';
    const spans = totalEl.querySelectorAll('span');
    if (spans[1]) spans[1].textContent = '$' + cartSubtotal().toFixed(2);
  }

  const step = DISCOURAGEMENT_STEPS[Math.min(cartStep, 2)];
  warnEl.textContent   = step.warning;
  stepEl.textContent   = step.stepMsg;
  stepEl.style.display = step.stepMsg ? 'block' : 'none';
  primaryBtn.textContent   = step.primary;
  secondaryBtn.textContent = step.secondary;
}

document.addEventListener('click', e => {
  if (e.target && e.target.id === 'cart-close') closeCart();
  if (e.target && e.target.id === 'cart-overlay') closeCart();

  if (e.target && e.target.id === 'cart-secondary') {
    if (cartStep === 0 || cart.length === 0) {
      closeCart();
    } else {
      cart = [];
      closeCart();
      showToast('Cart cleared. Good call.');
    }
  }

  if (e.target && e.target.id === 'cart-primary') {
    if (cart.length === 0) { closeCart(); return; }
    if (cartStep < 2) {
      cartStep++;
      renderCart();
    } else {
      confirmOrder();
    }
  }

  if (e.target && e.target.classList.contains('add-to-cart-btn')) {
    addToCart(e.target.dataset.addToCart);
  }
});

function confirmOrder() {
  const total = cartSubtotal();
  closeCart();

  localStorage.setItem(STORAGE_ORDER, Date.now().toString());
  addToLifetime(total);
  cart = [];
  cartStep = 0;

  const msg = document.getElementById('confirm-msg');
  if (msg) {
    msg.textContent = `Order total: $${total.toFixed(2)} — shipped at $22.22 per item. Rest-assured delays apply. Disappointment guaranteed. Rice has been notified. He put his fist to the screen. That is all.`;
  }

  const modal = document.getElementById('confirm-modal');
  if (modal) modal.style.display = 'flex';
}

window.closeConfirm = function() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.style.display = 'none';
};

/* ── UPSELL ITEMS ── */
function initUpsellItems() {
  document.querySelectorAll('[data-upsell]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.upsell;
      if (PRODUCTS[id]) addToCart(id);
    });
  });
}

/* ── DO NOT CLICK ── */
function bindDontClick() {
  const btn      = document.getElementById('dont-click-btn');
  const countEl  = document.getElementById('dont-click-count');
  if (!btn || !countEl) return;

  let clicks = parseInt(sessionStorage.getItem(STORAGE_CLICKS) || '0', 10);

  function updateCount() {
    if (clicks === 0) {
      countEl.textContent = '';
      return;
    }
    const msg = clicks === 1
      ? 'You clicked it. We noted it. We don\'t understand why.'
      : `You've clicked it ${clicks} time${clicks > 1 ? 's' : ''}. We still don't understand why. We have documented this.`;
    countEl.textContent = msg;
  }

  btn.addEventListener('click', () => {
    clicks++;
    sessionStorage.setItem(STORAGE_CLICKS, clicks.toString());
    updateCount();
  });

  updateCount();
}

/* ── LANGUAGE RANDOMIZER ── */
function bindLanguageBtn() {
  const btn = document.getElementById('lang-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    langIndex = (langIndex + 1) % LANGUAGES.length;
    applyLanguage(LANGUAGES[langIndex]);
  });
}

function applyLanguage(lang) {
  const announceEl  = document.getElementById('announce-text');
  const taglineEl   = document.getElementById('nav-tagline');
  const heroTitleEl = document.getElementById('hero-title');
  const heroSubEl   = document.getElementById('hero-sub');
  const cta1El      = document.getElementById('hero-cta1');
  const cta2El      = document.getElementById('hero-cta2');
  const currentEl   = document.querySelector('.lang-float__current');

  if (announceEl)  announceEl.innerHTML  = lang.announce;
  if (taglineEl)   taglineEl.textContent = lang.tagline;
  if (heroTitleEl) heroTitleEl.innerHTML = lang.heroTitle;
  if (heroSubEl)   heroSubEl.textContent = lang.heroSub;
  if (cta1El)      cta1El.textContent    = lang.cta1;
  if (cta2El)      cta2El.textContent    = lang.cta2;
  if (currentEl)   currentEl.textContent = lang.label;
}

/* ── TOAST ── */
function showToast(msg, duration = 3000) {
  const el = document.getElementById('is-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), duration);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initFistbumpGate();
  initLifetimeCounter();
  bindRockReveal();
  initUpsellItems();
  bindDontClick();
  bindLanguageBtn();

  // floating cart button (if any product triggers it from nav or elsewhere)
  const cartFloatBtn = document.getElementById('cart-float-btn');
  if (cartFloatBtn) {
    cartFloatBtn.addEventListener('click', () => {
      if (cart.length) openCart();
      else showToast('Your cart is empty. Excellent choice.');
    });
  }
});
