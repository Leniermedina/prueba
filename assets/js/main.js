
import { readCart, updateQty, clearCart, cartTotal } from './cart.js';

function cartItemCount(){
  try { return readCart().reduce((a, it)=> a + (Number(it.qty)||0), 0); } catch(e){ return 0; }
}

import { getLang, setLang, applyTranslations } from './i18n.js';

const THEME_KEY = 'ebf_theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}
function initTheme() {
  setTheme(getTheme());
}

function renderCartBadge() {
  const el = document.querySelector('.cart-count');
  if (!el) return;
  const cart = readCart();
  const count = cart.reduce((n, i) => n + i.qty, 0);
  el.textContent = count;
}

function buildCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const list = drawer.querySelector('.cart-drawer__list');
  const totalEl = drawer.querySelector('.total-chip');
  const emptyMsg = drawer.querySelector('.cart-empty-msg');

  const cart = readCart();
  list.innerHTML = '';
  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-row__title">${item.nombre}</div>
        <div>$${item.precio.toFixed(2)}</div>
        <input type="number" min="0" value="${item.qty}" class="qty-input" data-id="${item.id}">
        <button class="icon-btn" data-action="del" data-id="${item.id}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      `;
      list.appendChild(row);
    });
  }
  totalEl.textContent = '$' + cartTotal(cart).toFixed(2); updateCartBadges();

  // events
  list.querySelectorAll('input.qty-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const id = inp.dataset.id;
      const qty = Math.max(0, parseInt(inp.value || '0', 10));
      updateQty(id, qty); updateCartBadges();
    });
  });
  list.querySelectorAll('[data-action="del"]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateQty(btn.dataset.id, 0); updateCartBadges();
    });
  });
}

function toggleDrawer(force) {
  const drawer = document.querySelector('.cart-drawer');
  const show = typeof force === 'boolean' ? force : !(drawer.style.display === 'flex');
  drawer.style.display = show ? 'flex' : 'none';
  if (drawer.style.display === 'flex') buildCartDrawer();
}

function createFloatingCart(){
  if (document.querySelector('.floating-cart')) return;
  const btn = document.createElement('button');
  btn.className = 'floating-cart';
  btn.id = 'floating-cart';
  btn.innerHTML = '<span class="badge" aria-label="Items in cart">0</span><i class="fa-solid fa-cart-shopping"></i>';
  btn.addEventListener('click', () => toggleDrawer(true));
  document.body.appendChild(btn);
  // initialize badge
  updateCartBadges();

  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // show floating when scrolled
    if (y > 120) btn.classList.add('floating-cart--show');
    else btn.classList.remove('floating-cart--show');

    // autohide header
    const header = document.querySelector('.header');
    if (!header) return;
    if (y > lastY && y > 80) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    lastY = y;
  }, { passive: true });
}

export function initHeader() {
  // Theme
  initTheme();
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  // Lang
  applyTranslations();
  document.querySelector('#lang-toggle')?.addEventListener('click', () => {
    const next = getLang() === 'es' ? 'en' : 'es';
    setLang(next);
  });

  // Cart
  renderCartBadge();
  document.querySelector('#cart-toggle')?.addEventListener('click', () => toggleDrawer());

  document.addEventListener('cart:updated', () => {
    renderCartBadge();
    buildCartDrawer();
  });
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const drawer = document.querySelector('.cart-drawer');
    if (!drawer) return;
    const within = drawer.contains(e.target) || e.target.closest('#cart-toggle') || e.target.closest('#floating-cart');
    if (!within && drawer.style.display === 'flex') drawer.style.display = 'none';
  });

  // WhatsApp checkout
  document.querySelector('#wa-checkout')?.addEventListener('click', () => {
    const cart = readCart();
    if (cart.length === 0) return;
    let msg = '¡Hola! Quiero este pedido:%0A%0A';
    cart.forEach(i => {
      msg += `- ${i.nombre} x${i.qty} = $${(i.precio*i.qty).toFixed(2)}%0A`;
    });
    msg += `%0ATotal: $${cartTotal(cart).toFixed(2)}`;
    const telefono = '17864036850';
    const url = `https://wa.me/${telefono}?text=${msg}`;
    window.open(url, '_blank');
  });

  document.querySelector('#clear-cart')?.addEventListener('click', () => {
    clearCart(); updateCartBadges();
  });

  // Floating cart + autohide header
  createFloatingCart();
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
});

function initHeroSlider(){
  const root = document.getElementById('hero-slider');
  if(!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  let i = 0;
  setInterval(()=>{
    slides[i].classList.remove('active');
    i = (i+1) % slides.length;
    slides[i].classList.add('active');
  }, 4500);
}
document.addEventListener('DOMContentLoaded', initHeroSlider);

function initCountUp(){
  const els = document.querySelectorAll('[data-count-to]');
  if(!els.length) return;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const locale = (document.documentElement.lang || navigator.language || 'es').slice(0,2);
  const format = (n) => Number(n).toLocaleString(locale);
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const to = parseFloat(el.getAttribute('data-count-to')) || 0;
        const dur = parseInt(el.getAttribute('data-count-dur')||'1500',10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const start = performance.now();
        function step(now){
          const p = Math.min(1, (now-start)/dur);
          const v = Math.round((to)*ease(p));
          el.textContent = `${prefix}${format(v)}${suffix}`;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });
  els.forEach(el=> obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initCountUp);

// ---- Global init: theme + i18n bindings ----
document.addEventListener('DOMContentLoaded', ()=>{
  try{
    // Theme persistence
    const saved = localStorage.getItem('ebf_theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);

    // Nav labels data-i18n
    const nav = document.querySelector('nav') || document.querySelector('.nav');
    if(nav){
      const map = { 'Inicio':'nav.home', 'Tienda':'nav.shop', 'Contacto':'nav.contact', 'Acerca de':'nav.about' };
      nav.querySelectorAll('a').forEach(a=>{
        const txt = a.textContent.trim();
        const key = map[txt];
        if(key){ a.setAttribute('data-i18n', key); }
      });
    }
    // Apply translations globally
    if (typeof applyTranslations === 'function') applyTranslations();
  }catch(e){ console.warn('init error', e); }
});


// Update cart badges for header and floating cart
function updateCartBadges(){
  const count = cartItemCount();
  const hdrBadge = document.querySelector('[data-cart-count]');
  if(hdrBadge) hdrBadge.textContent = String(count);
  const floatBadge = document.querySelector('#floating-cart .badge');
  if(floatBadge) floatBadge.textContent = String(count);
}
