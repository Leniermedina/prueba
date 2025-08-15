
(() => {
  const API = {
    products: '/api/products',
    texts: '/api/texts',
    register: '/api/register',
    login: '/api/login',
    me: '/api/me',
    upload: '/api/upload',
  };

  const token = () => localStorage.getItem('AUTH_TOKEN') || '';
  const setToken = (t='') => localStorage.setItem('AUTH_TOKEN', t);
  const authHeaders = () => token() ? { Authorization: 'Bearer ' + token() } : {};
  async function getMe() {
    if (!token()) return null;
    try {
      const r = await fetch(API.me, { headers: authHeaders(), cache:'no-store' });
      if (!r.ok) return null;
      return await r.json();
    } catch { return null; }
  }

  const CART_KEY = 'DCC_CART';
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  };
  const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  const addToCart = (product, qty=1) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].qty += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: Number(product.price||0), qty });
    }
    setCart(cart);
    updateCartBadge();
  };
  const removeFromCart = (id) => { setCart(getCart().filter(i => i.id !== id)); updateCartUI(); updateCartBadge(); };
  const setQty = (id, qty) => {
    const cart = getCart().map(i => i.id===id ? { ...i, qty: Math.max(1, qty|0) } : i);
    setCart(cart); updateCartUI(); updateCartBadge();
  };
  const cartTotal = () => getCart().reduce((a,i)=>a + i.price*i.qty, 0);

  function ensureStyles() {
    const css = `
      .btn-nav{
        text-decoration:none;padding:8px 12px;border-radius:30px;
        background:#000; color:#00ff9d; border:1.5px solid #00ff9d;
        box-shadow:0 0 10px rgba(0,255,157,.35);
        font-weight:600; font-size:.95rem; display:inline-flex; align-items:center; gap:8px
      }
      .btn-nav:hover,.btn-nav.active{ box-shadow:0 0 14px rgba(0,255,157,.6) }
      .app-header{background:rgba(0,0,0,.95);border-bottom:1px solid #00ff9d;box-shadow:0 0 15px rgba(0,255,157,.5);position:sticky;top:0;z-index:999}
      .cart-badge{min-width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:.75rem;background:#ff9800;color:#fff;border-radius:10px;padding:0 6px}
    `;
    const s = document.createElement('style');
    s.textContent = css; document.head.appendChild(s);
  }

  function buildNavbar() {
    ensureStyles();
    const navHtml = `
      <header class="app-header">
        <div class="container" style="max-width:1300px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 15px;">
          <div class="logo" style="font-weight:700;color:#00ff9d">Dual <span style="color:#fff">Cell</span> <span style="color:#00ff9d">Corp</span></div>
          <nav>
            <ul style="display:flex;list-style:none;gap:8px;flex-wrap:wrap;margin:0;padding:0">
              <li><a class="btn-nav" href="/index.html">Home</a></li>
              <li><a class="btn-nav" href="/productos.html">Productos</a></li>
              <li><a class="btn-nav" href="/acerca.html">Acerca de</a></li>
              <li><a class="btn-nav" href="/carrito.html" id="nav-cart"><i class="fa fa-shopping-cart"></i> Carrito <span id="cart-badge" class="cart-badge" style="display:none">0</span></a></li>
              <li><a class="btn-nav" href="/login.html" id="nav-login"><i class="fa fa-user"></i> Entrar</a></li>
            </ul>
          </nav>
        </div>
      </header>`;
    const existing = document.querySelector('header') || document.querySelector('.header');
    if (existing && !document.body.classList.contains('keep-header')) {
      existing.insertAdjacentHTML('beforebegin', navHtml);
    } else {
      document.body.insertAdjacentHTML('afterbegin', navHtml);
    }
    const path = location.pathname.replace('/','') || 'index.html';
    document.querySelectorAll('.btn-nav').forEach(a => {
      const href = (a.getAttribute('href')||'').replace('/','');
      if (href === path) a.classList.add('active');
    });
    updateCartBadge();
  }

  function updateCartBadge() {
    const n = getCart().reduce((a,i)=>a+i.qty,0);
    const b = document.getElementById('cart-badge');
    if (!b) return;
    if (n>0){ b.textContent = n; b.style.display = 'inline-flex'; } else { b.style.display='none'; }
  }

  async function injectAuthOverlay() {
    const p = location.pathname;
    if (p.endsWith('login.html') || p.endsWith('carrito.html') || p.endsWith('admin.html')) return;
    const me = await getMe();
    if (me) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;z-index:2000`;
    overlay.innerHTML = `
      <div style="background:#0f1c2f;border:1px solid #00ff9d;border-radius:16px;box-shadow:0 0 25px rgba(0,255,157,.3);padding:20px;max-width:520px;width:92%;color:#d7ffe9">
        <h2 style="margin:0 0 12px;color:#00ff9d">Bienvenido</h2>
        <p style="margin:0 0 16px;opacity:.9">Regístrate o inicia sesión para continuar a Dual Cell Corp.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="/login.html" class="btn-nav">Iniciar sesión</a>
          <a href="/login.html#signup" class="btn-nav">Registrarme</a>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  async function renderProducts(selector='.products-grid') {
    const grid = document.querySelector(selector);
    if (!grid) return;
    try {
      const r = await fetch(API.products, { cache:'no-store' });
      const data = await r.json();
      if (!Array.isArray(data) || !data.length) {
        grid.innerHTML = `<p style="color:#b1ffdd">Sin productos por ahora.</p>`;
        return;
      }
      grid.innerHTML = data.map(p => `
        <div class="product-card">
          <div class="product-image"><img src="${p.image}" alt="${(p.name||'Producto')}" loading="lazy"></div>
          <div class="product-info">
            <div class="product-title">${p.name || ''}</div>
            <div class="product-price">$${Number(p.price||0).toFixed(2)}</div>
            <div class="quantity-controls">
              <button class="quantity-btn" data-act="dec">-</button>
              <input class="quantity-input" type="number" min="1" value="1">
              <button class="quantity-btn" data-act="inc">+</button>
            </div>
            <button class="add-to-cart-btn"><i class="fa fa-cart-plus"></i> Añadir</button>
          </div>
        </div>`).join('');

      grid.querySelectorAll('.product-card').forEach((card, idx) => {
        const p = data[idx];
        const qtyInput = card.querySelector('.quantity-input');
        card.querySelectorAll('.quantity-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            let v = parseInt(qtyInput.value||'1',10);
            v = isNaN(v)?1:v;
            if (btn.dataset.act === 'inc') v++;
            else v = Math.max(1, v-1);
            qtyInput.value = v;
          });
        });
        card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
          const qty = Math.max(1, parseInt(qtyInput.value||'1',10));
          addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, qty);
          card.querySelector('.add-to-cart-btn').classList.add('added');
          card.querySelector('.add-to-cart-btn').innerHTML = 'Añadido ✓';
          setTimeout(() => {
            const btn = card.querySelector('.add-to-cart-btn');
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fa fa-cart-plus"></i> Añadir';
          }, 1200);
        });
      });
    } catch (e) {
      grid.innerHTML = `<p style="color:#ffb3b3">No se pudo cargar productos.</p>`;
    }
  }

  function renderCartPage() {
    const wrap = document.getElementById('cart-page');
    if (!wrap) return;
    function row(i) {
      const sub = i.price * i.qty;
      return `
        <div class="cart-row">
          <div class="info">
            <div class="name">${i.name}</div>
            <div class="unit">$${i.price.toFixed(2)} x ${i.qty}</div>
          </div>
          <div class="actions">
            <button data-action="dec">-</button>
            <input type="number" min="1" value="${i.qty}" />
            <button data-action="inc">+</button>
            <button data-action="rm" title="Eliminar">✕</button>
            <div class="sub">$${sub.toFixed(2)}</div>
          </div>
        </div>`;
    }
    function paint() {
      const cart = getCart();
      if (!cart.length) {
        wrap.innerHTML = `<div class="empty">Tu carrito está vacío.</div>`;
        document.getElementById('cart-total')?.remove();
        document.getElementById('btn-wa')?.remove();
        updateCartBadge();
        return;
      }
      wrap.innerHTML = cart.map(row).join('');
      const totalEl = document.getElementById('cart-total') || (() => {
        const d = document.createElement('div'); d.id='cart-total'; d.style.cssText='margin:16px 0;font-weight:700;color:#00ff9d';
        d.textContent = 'Total: $' + cartTotal().toFixed(2);
        wrap.insertAdjacentElement('afterend', d);
        return d;
      })();
      totalEl.textContent = 'Total: $' + cartTotal().toFixed(2);

      let btn = document.getElementById('btn-wa');
      if (!btn) {
        btn = document.createElement('a');
        btn.id='btn-wa';
        btn.className='btn-nav';
        btn.style.marginTop='10px';
        btn.innerHTML = '<i class="fa fa-whatsapp"></i> Enviar pedido por WhatsApp';
        wrap.parentElement.appendChild(btn);
      }
      const msg = buildWhatsAppMessage();
      const phone = getWhatsAppNumberFromFooter() || '17863952896';
      btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      updateCartBadge();
    }
    function bind() {
      wrap.addEventListener('click', (e) => {
        const rowEl = e.target.closest('.cart-row'); if (!rowEl) return;
        const idx = Array.from(wrap.children).indexOf(rowEl);
        const cart = getCart();
        const item = cart[idx]; if (!item) return;

        if (e.target.dataset.action === 'rm') { removeFromCart(item.id); paint(); return; }
        if (e.target.dataset.action === 'inc') { setQty(item.id, item.qty+1); paint(); return; }
        if (e.target.dataset.action === 'dec') { setQty(item.id, Math.max(1,item.qty-1)); paint(); return; }
      });
      wrap.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT') {
          const rowEl = e.target.closest('.cart-row'); if (!rowEl) return;
          const idx = Array.from(wrap.children).indexOf(rowEl);
          const cart = getCart(); const item = cart[idx]; if (!item) return;
          const v = Math.max(1, parseInt(e.target.value||'1',10));
          setQty(item.id, v); paint();
        }
      });
    }
    bind(); paint();
  }

  function buildWhatsAppMessage() {
    const lines = ['*Haciendo la compra:*'];
    getCart().forEach(i => {
      lines.push(`- ${i.name} x ${i.qty} = $${(i.price*i.qty).toFixed(2)}`);
    });
    lines.push(`*Total:* $${cartTotal().toFixed(2)}`);
    return lines.join('\\n');
  }

  function getWhatsAppNumberFromFooter() {
    const telEl = document.querySelector('a[href^="tel:"]');
    if (telEl) return telEl.getAttribute('href').replace('tel:','').replace(/\\D/g,'');
    const waEl = document.querySelector('a[href*="wa.me"]') || document.querySelector('a[href*="api.whatsapp.com"]');
    if (waEl) {
      const href = waEl.getAttribute('href');
      let m = href.match(/wa\\.me\\/(\\d+)/);
      if (!m) m = href.match(/phone=(\\d+)/);
      if (m) return m[1];
    }
    return null;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    buildNavbar();
    injectAuthOverlay();
    if (document.querySelector('.products-grid')) renderProducts('.products-grid');
    if (document.getElementById('cart-page')) renderCartPage();
    if (document.getElementById('auth-forms')) initAuthForms();
    if (document.getElementById('admin-panel')) initAdminPanel();
  });

  function initAuthForms() {
    const loginF = document.getElementById('login-form');
    const regF = document.getElementById('register-form');
    if (loginF) loginF.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = loginF.email.value.trim().toLowerCase();
      const password = loginF.password.value;
      const r = await fetch(API.login, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      const data = await r.json();
      if (!r.ok) return alert(data.error || 'Error');
      setToken(data.token); location.href='/index.html';
    });
    if (regF) regF.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = regF.name.value.trim();
      const email = regF.email.value.trim().toLowerCase();
      const password = regF.password.value;
      const r = await fetch(API.register, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password }) });
      const data = await r.json();
      if (!r.ok) return alert(data.error || 'Error');
      setToken(data.token); location.href='/index.html';
    });
  }

  async function initAdminPanel() {
    const me = await getMe();
    if (!me) { alert('Inicia sesión'); location.href='/login.html'; return; }
    const listEl = document.getElementById('admin-products');
    const formEl = document.getElementById('admin-form');

    async function load() {
      const r = await fetch(API.products, { cache:'no-store' });
      const data = await r.json();
      listEl.innerHTML = (data||[]).map(p => `
        <li data-id="${'${p.id}'}">
          <img src="${'${p.image}'}" style="width:48px;height:48px;object-fit:cover;border:1px solid #00ff9d;border-radius:6px;margin-right:8px" />
          <strong>${'${p.name}'}</strong> — $${'${Number(p.price||0).toFixed(2)}'}
          <button data-act="edit">Editar</button>
          <button data-act="del">Eliminar</button>
        </li>
      `).join('');
    }

    listEl.addEventListener('click', async (e)=>{
      const li = e.target.closest('li'); if (!li) return;
      const id = li.dataset.id;
      if (e.target.dataset.act === 'del') {
        const ok = confirm('¿Eliminar producto?');
        if (!ok) return;
        const r = await fetch(API.products + '?id=' + encodeURIComponent(id), { method:'DELETE', headers: authHeaders() });
        if (r.status===204) load(); else alert('Error eliminando');
      }
      if (e.target.dataset.act === 'edit') {
        formEl.dataset.editing = id;
        formEl.name.value = li.querySelector('strong').textContent;
        const priceText = (li.textContent.match(/\\$(\\d+(\\.\\d+)?)/)||[])[1] || '0'
      }
    });

    formEl.addEventListener('submit', async (e)=>{
      e.preventDefault();
      let imageURL = formEl.imageUrl.value.trim();
      if (formEl.file.files[0]) {
        const fd = new FormData();
        fd.append('file', formEl.file.files[0]);
        const up = await fetch(API.upload, { method:'POST', body: fd, headers: authHeaders() });
        const uj = await up.json();
        if (!up.ok) return alert(uj.error||'Error subiendo imagen');
        imageURL = uj.url;
      }
      const body = {
        id: formEl.dataset.editing || undefined,
        name: formEl.name.value.trim(),
        price: Number(formEl.price.value||0),
        image: imageURL
      };
      const method = formEl.dataset.editing ? 'PUT' : 'POST';
      const r = await fetch(API.products, { method, headers: { ...authHeaders(), 'Content-Type':'application/json' }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) return alert(data.error||'Error');
      formEl.reset(); delete formEl.dataset.editing; await load();
    });

    load();
  }
})();
