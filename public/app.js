(() => {
  // Función para escapar HTML
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"']/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[tag] || tag));
  };

  const API = {
    products: '/api/products',
    texts: '/api/texts',
    register: '/api/register',
    login: '/api/login',
    me: '/api/me',
    upload: '/api/upload',
  };

  const token = () => localStorage.getItem('AUTH_TOKEN') || '';
  const setToken = (t = '') => localStorage.setItem('AUTH_TOKEN', t);
  const authHeaders = () => token() ? { Authorization: 'Bearer ' + token() } : {};
  
  async function getMe() {
    if (!token()) return null;
    try {
      const r = await fetch(API.me, { headers: authHeaders(), cache: 'no-store' });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      console.error('Error getting me:', e);
      return null;
    }
  }

  const CART_KEY = 'DCC_CART';
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || []; } catch { return []; }
  };
  const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  
  const addToCart = (product, qty = 1) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].qty += qty;
    } else {
      cart.push({ 
        id: product.id, 
        name: product.name, 
        price: Number(product.price || 0), 
        image: product.image,
        qty 
      });
    }
    setCart(cart);
    updateCartBadge();
  };
  
  const removeFromCart = (id) => { 
    setCart(getCart().filter(i => i.id !== id)); 
    updateCartUI(); 
    updateCartBadge(); 
  };
  
  const setQty = (id, qty) => {
    const cart = getCart().map(i => i.id === id ? { ...i, qty: Math.max(1, qty | 0) } : i);
    setCart(cart); 
    updateCartUI(); 
    updateCartBadge();
  };
  
  const cartTotal = () => getCart().reduce((a, i) => a + i.price * i.qty, 0);

  function ensureStyles() {
    const css = `
      :root {
        --verde-neon: #00ff9d;
        --verde-oscuro: #0a2e1c;
        --naranja-neon: #ff9d00;
        --blanco: #ffffff;
        --negro: #000000;
        --gris-oscuro: #0d0d0d;
      }
      
      .btn-nav {
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 30px;
        background: var(--negro);
        color: var(--naranja-neon);
        border: 1.5px solid var(--naranja-neon);
        box-shadow: 0 0 10px rgba(0, 255, 157, 0.35);
        font-weight: 600;
        font-size: 0.95rem;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
      }
      
      .btn-nav:hover, .btn-nav.active {
        box-shadow: 0 0 14px rgba(0, 255, 157, 0.6);
        background: var(--naranja-neon);
        color: var(--blanco);
      }
      
      .app-header {
        background: rgba(0, 0, 0, 0.95);
        border-bottom: 1px solid var(--verde-neon);
        box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
        position: sticky;
        top: 0;
        z-index: 999;
        padding: 10px 0;
      }
      
      .cart-badge {
        min-width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        background: var(--naranja-neon);
        color: var(--blanco);
        border-radius: 10px;
        padding: 0 6px;
      }
      
      .language-switcher {
        display: flex;
        align-items: center;
        background: rgba(0, 255, 157, 0.1);
        padding: 5px;
        border-radius: 50%;
        border: 1px solid var(--verde-neon);
        cursor: pointer;
        width: 34px;
        height: 34px;
        justify-content: center;
        transition: all 0.3s;
      }
      
      .language-switcher:hover {
        background: rgba(0, 255, 157, 0.2);
        transform: scale(1.1);
      }
      
      .language-switcher i {
        font-size: 1rem;
        color: var(--blanco);
      }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildNavbar() {
    ensureStyles();
    const navHtml = `
      <header class="app-header">
        <div class="container" style="max-width:1300px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 15px;">
          <div class="logo" style="font-weight:700;color:var(--verde-neon)">Dual <span style="color:var(--blanco)">Cell</span> <span style="color:var(--verde-neon)">Corp</span></div>
          <nav>
            <ul style="display:flex;list-style:none;gap:8px;flex-wrap:wrap;margin:0;padding:0">
              <li><a class="btn-nav" href="/index.html"><i class="fa fa-home"></i> <span data-i18n="home">Home</span></a></li>
              <li><a class="btn-nav" href="/productos.html"><i class="fa fa-shopping-bag"></i> <span data-i18n="products">Productos</span></a></li>
              <li><a class="btn-nav" href="/acerca.html"><i class="fa fa-info-circle"></i> <span data-i18n="about">Acerca de</span></a></li>
              <li><a class="btn-nav" href="/carrito.html" id="nav-cart"><i class="fa fa-shopping-cart"></i> <span data-i18n="cart">Carrito</span> <span id="cart-badge" class="cart-badge" style="display:none">0</span></a></li>
              <li>
                <div class="language-switcher" id="language-switcher">
                  <i class="fas fa-globe"></i>
                </div>
              </li>
              <li><a class="btn-nav" href="/login.html" id="nav-login"><i class="fa fa-user"></i> <span data-i18n="login">Entrar</span></a></li>
            </ul>
          </nav>
        </div>
      </header>`;
      
    document.body.insertAdjacentHTML('afterbegin', navHtml);
    
    // Activar botón de la página actual
    const path = location.pathname.replace('/', '') || 'index.html';
    document.querySelectorAll('.btn-nav').forEach(a => {
      const href = (a.getAttribute('href') || '').replace('/', '');
      if (href === path) a.classList.add('active');
    });
    
    updateCartBadge();
    setupLanguageSwitcher();
  }

  function updateCartBadge() {
    const n = getCart().reduce((a, i) => a + i.qty, 0);
    const b = document.getElementById('cart-badge');
    if (!b) return;
    if (n > 0) { 
      b.textContent = n; 
      b.style.display = 'inline-flex'; 
    } else { 
      b.style.display = 'none'; 
    }
  }

  function setupLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    if (!switcher) return;
    
    let isEnglish = localStorage.getItem('language') === 'en';
    
    switcher.addEventListener('click', () => {
      isEnglish = !isEnglish;
      localStorage.setItem('language', isEnglish ? 'en' : 'es');
      updateLanguage(isEnglish);
    });
  }
  
  function updateLanguage(isEnglish) {
    const translations = {
      home: { es: 'Inicio', en: 'Home' },
      products: { es: 'Productos', en: 'Products' },
      about: { es: 'Acerca de', en: 'About' },
      cart: { es: 'Carrito', en: 'Cart' },
      login: { es: 'Entrar', en: 'Login' },
      welcome: { es: 'Bienvenido', en: 'Welcome' },
      featured_products: { es: 'Productos Destacados', en: 'Featured Products' },
      see_more: { es: 'Ver más', en: 'See more' },
      add_to_cart: { es: 'Añadir al carrito', en: 'Add to cart' },
      // Agregar más traducciones según sea necesario
    };
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = isEnglish ? translations[key].en : translations[key].es;
      }
    });
  }

  async function renderProducts(selector = '.products-grid') {
    const grid = document.querySelector(selector);
    if (!grid) return;
    
    try {
      const r = await fetch(API.products, { cache: 'no-store' });
      const data = await r.json();
      
      if (!Array.isArray(data) || !data.length) {
        grid.innerHTML = `<p style="color:#b1ffdd">Sin productos por ahora.</p>`;
        return;
      }
      
      // Filtrar por categorías
      const moviles = data.filter(p => p.category === 'moviles');
      const covers = data.filter(p => p.category === 'covers');
      const accesorios = data.filter(p => p.category === 'accesorios');
      
      // Renderizar cada categoría
      if (moviles.length) {
        grid.innerHTML += `<h2 data-i18n="moviles">Móviles</h2><div class="products-category" id="moviles"></div>`;
        renderCategory(moviles, 'moviles');
      }
      
      if (covers.length) {
        grid.innerHTML += `<h2 data-i18n="covers">Covers</h2><div class="products-category" id="covers"></div>`;
        renderCategory(covers, 'covers');
      }
      
      if (accesorios.length) {
        grid.innerHTML += `<h2 data-i18n="accesorios">Accesorios</h2><div class="products-category" id="accesorios"></div>`;
        renderCategory(accesorios, 'accesorios');
      }
      
    } catch (e) {
      grid.innerHTML = `<p style="color:#ffb3b3">No se pudo cargar productos.</p>`;
    }
    
    function renderCategory(products, categoryId) {
      const container = document.getElementById(categoryId);
      if (!container) return;
      
      container.innerHTML = products.map(p => `
        <div class="product-card">
          <div class="product-image" onclick="showImageModal('${escapeHtml(p.image)}')">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">
          </div>
          <div class="product-info">
            <div class="product-title">${escapeHtml(p.name)}</div>
            <div class="product-price">$${Number(p.price || 0).toFixed(2)}</div>
            <div class="quantity-controls">
              <button class="quantity-btn" data-act="dec">-</button>
              <input class="quantity-input" type="number" min="1" value="1">
              <button class="quantity-btn" data-act="inc">+</button>
            </div>
            <button class="add-to-cart-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}" data-image="${escapeHtml(p.image)}">
              <i class="fa fa-cart-plus"></i> <span data-i18n="add_to_cart">Añadir al carrito</span>
            </button>
          </div>
        </div>
      `).join('');
      
      // Event listeners
      container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const name = btn.dataset.name;
          const price = btn.dataset.price;
          const image = btn.dataset.image;
          const qtyInput = btn.parentElement.querySelector('.quantity-input');
          const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
          
          addToCart({ id, name, price, image }, qty);
          
          btn.classList.add('added');
          btn.innerHTML = '<i class="fa fa-check"></i> Añadido';
          setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fa fa-cart-plus"></i> <span data-i18n="add_to_cart">Añadir al carrito</span>';
          }, 2000);
        });
      });
      
      container.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.parentElement.querySelector('.quantity-input');
          let val = parseInt(input.value || '1', 10);
          if (btn.dataset.act === 'inc') {
            input.value = val + 1;
          } else {
            input.value = Math.max(1, val - 1);
          }
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación - SOLUCIÓN CLAVE
    const publicPages = ['/index.html', '/productos.html', '/acerca.html', '/login.html', '/carrito.html'];
    const currentPage = location.pathname;
    
    // Permitir páginas públicas sin autenticación
    if (publicPages.some(page => currentPage.endsWith(page))) {
      buildNavbar();
      updateCartBadge();
      updateLanguage(localStorage.getItem('language') === 'en');
      if (document.querySelector('.products-grid')) renderProducts('.products-grid');
      return;
    }

    const me = await getMe();
    const isLoginPage = currentPage.includes('login.html');
    
    if (!me && !isLoginPage) {
      window.location.href = '/login.html';
      return;
    }
    
    // Si es admin y está en página de admin, redirigir
    if (me && me.isAdmin && !currentPage.includes('admin.html')) {
      window.location.href = '/admin.html';
    }
    
    buildNavbar();
    updateCartBadge();
    
    // Cargar idioma guardado
    const savedLang = localStorage.getItem('language') || 'es';
    updateLanguage(savedLang === 'en');
    
    if (document.querySelector('.products-grid')) renderProducts('.products-grid');
    if (document.getElementById('cart-page')) renderCartPage();
    if (document.getElementById('auth-forms')) initAuthForms();
    if (document.getElementById('admin-panel')) initAdminPanel();
  });
})();

// Funciones globales
function showImageModal(imageSrc) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <img src="${imageSrc}" style="max-width: 90%; max-height: 90%; border-radius: 10px; box-shadow: 0 0 30px rgba(0, 255, 157, 0.3);">
    <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
  `;
  
  modal.querySelector('button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  document.body.appendChild(modal);
}