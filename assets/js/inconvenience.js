/**
 * The Inconvenience Store™
 * Anti-commerce commerce engine.
 * Built by Claude + Rice | No Ads. No BS.
 */

'use strict';

// ─────────────────────────────────────────────────────────────
//  PRODUCTS
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'ugly-rock',
    name: '#uglyrock$2™',
    price: 2.00,
    shipping: 20.00,
    badge: 'FEATURED / PLEASE DON\'T',
    badgeType: 'danger',
    thankYou: false,
    featured: true
  },
  {
    id: 'clamshell-scissors',
    name: 'Premium Scissors (Extreme Clamshell)',
    price: 14.99,
    shipping: 8.99,
    badge: 'TECHNICALLY USEFUL',
    badgeType: 'warn',
    thankYou: true,
    featured: false
  },
  {
    id: 'battery-pack',
    name: 'Varietal Battery Pack™ (Misc Charge)',
    price: 6.00,
    shipping: 9.99,
    badge: 'PROBABLY HAS AAAS',
    badgeType: 'ugly',
    thankYou: true,
    featured: false
  },
  {
    id: 'junk-drawer',
    name: 'Curated Junk Drawer Starter Kit™',
    price: 11.00,
    shipping: 12.00,
    badge: 'COMPLETE THE LOOK',
    badgeType: 'new',
    thankYou: true,
    featured: false
  }
];

// ─────────────────────────────────────────────────────────────
//  CART STATE
// ─────────────────────────────────────────────────────────────
let cart = [];
let cartStep = 0;

const CART_STEPS = [
  {
    heading: 'Your Bag',
    sub: 'You can still leave.',
    primaryLabel: 'Proceed to Regret →',
    secondaryLabel: 'Actually, Never Mind',
    primaryAction: 'nextStep',
    secondaryAction: 'closeCart'
  },
  {
    heading: 'Are You Sure?',
    sub: 'Like. Actually sure.',
    msg: 'This is a genuine question. You could literally just go outside and find a rock. A better rock. A rock with some dignity. And keep the $22.',
    primaryLabel: 'Yes, I\'m Sure (I\'m Not Sure)',
    secondaryLabel: 'You Know What, No',
    primaryAction: 'nextStep',
    secondaryAction: 'closeCart'
  },
  {
    heading: 'Last Chance.',
    sub: 'For real this time.',
    msg: 'Rice will not say thank you. That is disclosed. That is in the Bible. Shipping is $20 plus tax. You are about to spend more on shipping than on the item. You know this. You are choosing this. Are you choosing this?',
    primaryLabel: 'Confirm Order (Please Don\'t)',
    secondaryLabel: 'Go Buy Something Better',
    primaryAction: 'confirmOrder',
    secondaryAction: 'closeCart'
  }
];

const ROCK_AFFIRMATIONS = [
  'It\'s just a rock.',
  'You could have gone outside.',
  'This will not change your life.',
  'We are almost offended that you made it this far.',
  'The rock does not know you.',
  'The rock will not remember this.',
  'There is no warranty. There never was.',
  'Thank you. (We will not say this again. Actually we didn\'t say it.)',
  'Rice has been notified. He is not pleased.',
  'Your rock is being located. This is taking a long time. It\'s fine.'
];

// ─────────────────────────────────────────────────────────────
//  DOM READY
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindRockReveal();
  bindAddToCart();
  bindCartUI();
  bindCartOverlay();
});

// ─────────────────────────────────────────────────────────────
//  ROCK REVEAL — requires clicking "I Understand"
// ─────────────────────────────────────────────────────────────
function bindRockReveal() {
  const btn = document.getElementById('reveal-rock-btn');
  const container = document.getElementById('rock-container');
  if (!btn || !container) return;

  btn.addEventListener('click', () => {
    container.classList.add('rock-revealed');
    btn.textContent = 'You were warned.';
    btn.disabled = true;
    btn.style.opacity = '0.4';
    showToast('You looked. That\'s on you.');
  });
}

// ─────────────────────────────────────────────────────────────
//  ADD TO CART
// ─────────────────────────────────────────────────────────────
function bindAddToCart() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      const productId = btn.dataset.addToCart;
      addToCart(productId, btn);
    });
  });
}

function addToCart(productId, btn) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Check if already in cart
  if (cart.find(i => i.id === productId)) {
    showToast('It\'s already in there. One is plenty. More than plenty.');
    return;
  }

  cart.push({ ...product, qty: 1 });

  // Button feedback
  const original = btn.textContent;
  btn.textContent = 'Added. We\'re disappointed in you.';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ In Cart (unfortunate)';
    btn.style.opacity = '0.6';
  }, 1800);

  if (productId === 'ugly-rock') {
    showToast('Added to cart. Rice has been informed. He said nothing.');
  } else {
    showToast('Added. Fine.');
  }

  openCart();
}

// ─────────────────────────────────────────────────────────────
//  CART UI
// ─────────────────────────────────────────────────────────────
function bindCartUI() {
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-primary')?.addEventListener('click', handleCartPrimary);
  document.getElementById('cart-secondary')?.addEventListener('click', handleCartSecondary);
}

function bindCartOverlay() {
  document.getElementById('cart-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'cart-overlay') closeCart();
  });
}

function openCart() {
  cartStep = 0;
  renderCart();
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
  cartStep = 0;
}

function handleCartPrimary() {
  const step = CART_STEPS[cartStep];
  if (step.primaryAction === 'nextStep') {
    cartStep++;
    renderCart();
  } else if (step.primaryAction === 'confirmOrder') {
    confirmOrder();
  }
}

function handleCartSecondary() {
  closeCart();
  if (cartStep > 0) {
    showToast('A wise choice. Sincerely.');
  }
}

function renderCart() {
  const step = CART_STEPS[cartStep];
  const modal = document.getElementById('cart-modal');
  if (!modal) return;

  // Title
  modal.querySelector('.cart-modal__title').textContent = step.heading;
  modal.querySelector('.cart-modal__subtitle').textContent = step.sub;

  // Items (only show on step 0)
  const itemsSection = modal.querySelector('.cart-modal__items');
  itemsSection.style.display = cartStep === 0 ? 'block' : 'none';

  if (cartStep === 0) {
    itemsSection.innerHTML = '';
    let subtotal = 0;
    let shippingTotal = 0;

    cart.forEach(item => {
      subtotal += item.price;
      shippingTotal += item.shipping;
      const div = document.createElement('div');
      div.className = 'cart-modal__item';
      div.innerHTML = `
        <div>
          <div class="cart-modal__item-name">${item.name}</div>
          <span class="cart-modal__item-note">Shipping: $${item.shipping.toFixed(2)} + tax</span>
          ${!item.thankYou ? '<span class="cart-modal__item-note">No thank you will be issued upon purchase.</span>' : ''}
        </div>
        <div style="font-weight:700; white-space:nowrap;">$${item.price.toFixed(2)}</div>
      `;
      itemsSection.appendChild(div);
    });

    const total = subtotal + shippingTotal;
    const totalEl = modal.querySelector('.cart-modal__total');
    totalEl.innerHTML = `<span>Total (est.)</span><span>$${total.toFixed(2)}</span>`;

    const warnEl = modal.querySelector('.cart-modal__warning');
    warnEl.textContent = `Shipping costs $${shippingTotal.toFixed(2)} of this total. The item(s) cost $${subtotal.toFixed(2)}. We want you to sit with that.`;
  }

  // Step message
  const msgEl = modal.querySelector('.cart-modal__step-msg');
  msgEl.textContent = step.msg || '';
  msgEl.style.display = step.msg ? 'block' : 'none';

  // Buttons
  modal.querySelector('#cart-primary').textContent = step.primaryLabel;
  modal.querySelector('#cart-secondary').textContent = step.secondaryLabel;
}

function confirmOrder() {
  closeCart();
  const modal = document.getElementById('confirm-modal');
  if (modal) {
    const msg = ROCK_AFFIRMATIONS[Math.floor(Math.random() * ROCK_AFFIRMATIONS.length)];
    document.getElementById('confirm-msg').textContent = msg;
    modal.style.display = 'flex';
  } else {
    // Fallback toast sequence
    showToast('Order placed. Rice has been notified. He said nothing.');
  }
}

// ─────────────────────────────────────────────────────────────
//  CONFIRM MODAL
// ─────────────────────────────────────────────────────────────
window.closeConfirm = function() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.style.display = 'none';
  cart = [];
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Add to Cart (Please Don\'t)';
  });
};

// ─────────────────────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────────────────────
let toastTimer;
window.showToast = function(msg) {
  const toast = document.getElementById('is-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
};
