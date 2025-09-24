
import { readCart, updateQty, clearCart, cartTotal } from './cart.js';
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
  totalEl.textContent = '$' + cartTotal(cart).toFixed(2);

  // events
  list.querySelectorAll('input.qty-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const id = inp.dataset.id;
      const qty = Math.max(0, parseInt(inp.value || '0', 10));
      updateQty(id, qty);
    });
  });
  list.querySelectorAll('[data-action="del"]').forEach(btn => {
    btn.addEventListener('click', () => {
      updateQty(btn.dataset.id, 0);
    });
  });
}

function toggleDrawer(force) {
  const drawer = document.querySelector('.cart-drawer');
  const show = typeof force === 'boolean' ? force : !(drawer.style.display === 'flex');
  drawer.style.display = show ? 'flex' : 'none';
  if (drawer.style.display === 'flex') buildCartDrawer();
}

function createFloatingCart() {
  if (document.querySelector('.floating-cart')) return;
  const btn = document.createElement('button');
  btn.className = 'floating-cart';
  btn.id = 'floating-cart';
  btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
  btn.addEventListener('click', () => toggleDrawer(true));
  document.body.appendChild(btn);

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
    clearCart();
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
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const to = parseFloat(el.getAttribute('data-count-to')) || 0;
        const dur = parseInt(el.getAttribute('data-count-dur')||'1500',10);
        const start = performance.now();
        function step(now){
          const p = Math.min(1, (now-start)/dur);
          const v = Math.round((to)*ease(p));
          el.textContent = v.toLocaleString();
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.35 });
  els.forEach(el=> obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initCountUp);
