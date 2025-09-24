
// ========= i18n =========
(function(){
  const I18N_STORAGE_KEY = 'ebf_lang';
  const MESSAGES = {
    es: {
      'nav.home': 'Inicio',
      'nav.shop': 'Tienda',
      'nav.contact': 'Contacto',
      'nav.about': 'Acerca de',

      'hero.title': 'El Bosque Farm',
      'hero.subtitle': 'Productos agropecuarios de calidad: animales, árboles frutales y ornamentales criados y cultivados de forma sostenible.',
      'hero.cta': 'Ver productos',

      'home.categories': 'Nuestras Categorías',
      'category.animals.title': 'Animales',
      'category.animals.desc': 'Pollitos, gallinas, guineos, patos…',
      'category.animals.cta': 'Ver Animales',
      'category.fruit.title': 'Árboles Frutales',
      'category.fruit.desc': 'Mango, naranjo, aguacate, limonero…',
      'category.fruit.cta': 'Ver Frutales',
      'category.ornamental.title': 'Árboles Ornamentales',
      'category.ornamental.desc': 'Jacarandá, magnolia, roble, ciprés…',
      'category.ornamental.cta': 'Ver Ornamentales',

      'home.reviews': 'Reseñas de clientes',
      'review.1': 'Los pollitos llegaron sanos y fuertes. Atención de primera.',
      'review.1.by': '— Marta G.',
      'review.2': 'El limonero prendió perfecto. Muy satisfecho con la calidad.',
      'review.2.by': '— Carlos P.',
      'review.3': 'Entrega rápida y buena comunicación. Repetiré.',
      'review.3.by': '— Ana R.',

      'home.stats.title': 'Nuestra Trayectoria',
      'home.stats.years': 'Años de experiencia',
      'home.stats.products': 'Productos vendidos',
      'home.stats.clients': 'Clientes satisfechos',
      'home.stats.note1': 'Creciendo de forma constante y responsable.',
      'home.stats.note2': 'Animales y árboles entregados con garantía.',
      'home.stats.note3': 'Relaciones de largo plazo, no solo ventas.',

      'shop.title': 'Nuestros Productos',
      'filters.all': 'Todos',
      'filters.animals': 'Animales',
      'filters.fruit': 'Árboles Frutales',
      'filters.ornamental': 'Árboles Ornamentales',
      'search.placeholder': 'Buscar productos...',

      'cart.title': 'Tu Carrito',
      'cart.empty': 'El carrito está vacío',
      'cart.total': 'Total',
      'cart.checkout': 'Enviar pedido por WhatsApp',
      'cart.clear': 'Vaciar carrito',

      'contact.title': 'Escríbenos',
      'contact.subtitle': 'Envíanos un mensaje y te respondemos pronto',
      'contact.name': 'Nombre',
      'contact.email': 'Correo',
      'contact.message': 'Mensaje',
      'contact.send': 'Enviar',

      'about.title': 'Acerca de El Bosque Farm',
      'about.intro1': 'En El Bosque Farm creemos en la conexión entre la tierra, los animales y las personas. Somos una compañía familiar dedicada a la producción agropecuaria sostenible, con el compromiso de brindar alimentos y productos naturales de la más alta calidad.',
      'about.intro2': 'Nuestro viaje comenzó con una pequeña finca y la visión de rescatar las prácticas tradicionales del campo, combinándolas con innovación moderna para asegurar la frescura y el bienestar de nuestros animales y cultivos.',
      'about.block1.title': 'Bienestar Animal',
      'about.block1.desc': 'Cuidamos de nuestros animales con dedicación, asegurando que crezcan en un ambiente sano y natural.',
      'about.block2.title': 'Cultivos Sostenibles',
      'about.block2.desc': 'Nuestros árboles frutales son cultivados con prácticas respetuosas con el medio ambiente.',
      'about.block3.title': 'Belleza Natural',
      'about.block3.desc': 'Ofrecemos variedades ornamentales que embellecen cualquier entorno.',
      'about.mission.title': 'Nuestra Misión',
      'about.mission.desc': 'Queremos que cada producto de El Bosque Farm transmita confianza, calidad y respeto por la naturaleza. Nos esforzamos por ser un referente en el mercado agropecuario, destacando por nuestra ética y transparencia.',
      'about.values.title': 'Nuestros Valores',
      'about.values.item1': 'Sostenibilidad: Cuidamos los recursos naturales para las futuras generaciones.',
      'about.values.item2': 'Calidad: Garantizamos productos frescos y confiables.',
      'about.values.item3': 'Innovación: Incorporamos tecnología sin perder la esencia tradicional.',
      'about.values.item4': 'Compromiso: Con nuestros clientes, nuestra comunidad y el medio ambiente.',
    },
    en: {
      'nav.home': 'Home',
      'nav.shop': 'Shop',
      'nav.contact': 'Contact',
      'nav.about': 'About',

      'hero.title': 'El Bosque Farm',
      'hero.subtitle': 'Quality farm products: animals, fruit trees and ornamental trees grown sustainably.',
      'hero.cta': 'View products',

      'home.categories': 'Our Categories',
      'category.animals.title': 'Animals',
      'category.animals.desc': 'Chicks, hens, guinea fowl, ducks…',
      'category.animals.cta': 'View Animals',
      'category.fruit.title': 'Fruit Trees',
      'category.fruit.desc': 'Mango, orange, avocado, lemon…',
      'category.fruit.cta': 'View Fruit Trees',
      'category.ornamental.title': 'Ornamental Trees',
      'category.ornamental.desc': 'Jacaranda, magnolia, oak, cypress…',
      'category.ornamental.cta': 'View Ornamentals',

      'home.reviews': 'Customer Reviews',
      'review.1': 'The chicks arrived healthy and strong. Great service.',
      'review.1.by': '— Marta G.',
      'review.2': 'The lemon tree took root perfectly. Very satisfied with the quality.',
      'review.2.by': '— Carlos P.',
      'review.3': 'Fast delivery and good communication. Will buy again.',
      'review.3.by': '— Ana R.',

      'home.stats.title': 'Our Track Record',
      'home.stats.years': 'Years of experience',
      'home.stats.products': 'Products sold',
      'home.stats.clients': 'Happy customers',
      'home.stats.note1': 'Consistent and responsible growth.',
      'home.stats.note2': 'Animals and trees delivered with guarantee.',
      'home.stats.note3': 'Long‑term relationships, not just sales.',

      'shop.title': 'Our Products',
      'filters.all': 'All',
      'filters.animals': 'Animals',
      'filters.fruit': 'Fruit Trees',
      'filters.ornamental': 'Ornamental Trees',
      'search.placeholder': 'Search products...',

      'cart.title': 'Your Cart',
      'cart.empty': 'Your cart is empty',
      'cart.total': 'Total',
      'cart.checkout': 'Send order via WhatsApp',
      'cart.clear': 'Clear cart',

      'contact.title': 'Contact Us',
      'contact.subtitle': 'Send us a message and we will reply soon',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.send': 'Send',

      'about.title': 'About El Bosque Farm',
      'about.intro1': 'At El Bosque Farm we believe in the connection between land, animals and people. We are a family company devoted to sustainable agriculture, committed to delivering natural, top‑quality products.',
      'about.intro2': 'Our journey began with a small farm and the vision to rescue traditional countryside practices, blending them with modern innovation to ensure freshness and the well‑being of our animals and crops.',
      'about.block1.title': 'Animal Welfare',
      'about.block1.desc': 'We care for our animals with dedication, ensuring they grow in a healthy, natural environment.',
      'about.block2.title': 'Sustainable Crops',
      'about.block2.desc': 'Our fruit trees are grown with eco‑friendly practices.',
      'about.block3.title': 'Natural Beauty',
      'about.block3.desc': 'We offer ornamental varieties that beautify any space.',
      'about.mission.title': 'Our Mission',
      'about.mission.desc': 'We want every El Bosque Farm product to convey trust, quality, and respect for nature. We strive to be a benchmark in the agricultural market, standing out for our ethics and transparency.',
      'about.values.title': 'Our Values',
      'about.values.item1': 'Sustainability: We care for natural resources for future generations.',
      'about.values.item2': 'Quality: We ensure fresh, reliable products.',
      'about.values.item3': 'Innovation: We add technology without losing our roots.',
      'about.values.item4': 'Commitment: To our customers, our community, and the environment.',
    }
  };

  function getLang(){ return localStorage.getItem(I18N_STORAGE_KEY) || 'es'; }
  function setLang(lang){
    localStorage.setItem(I18N_STORAGE_KEY, lang);
    applyTranslations();
  }
  function applyTranslations(root=document){
    const dict = MESSAGES[getLang()] || MESSAGES.es;
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = dict[key];
      if (!txt) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', txt);
      } else {
        el.textContent = txt;
      }
    });
  }

  window.I18N = { getLang, setLang, applyTranslations };
})();

// ========= Theme & Header & Floating Cart & Drawer =========
(function(){
  const THEME_KEY = 'ebf_theme';
  function getTheme(){ return localStorage.getItem(THEME_KEY) || 'light'; }
  function setTheme(t){ localStorage.setItem(THEME_KEY, t); document.documentElement.setAttribute('data-theme', t); }
  function initTheme(){ setTheme(getTheme()); }

  // Cart store
  const CART_KEY = 'ebf_cart';
  function readCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } }
  function writeCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); document.dispatchEvent(new CustomEvent('cart:updated', { detail:{ cart } })); }
  function addToCart(p, qty=1){
    const cart = readCart();
    const idx = cart.findIndex(i => i.id === p.id);
    if (idx >= 0) cart[idx].qty += qty; else cart.push({ id:p.id, nombre:p.nombre, precio:p.precio, qty });
    writeCart(cart);
  }
  function updateQty(id, qty){ let c = readCart(); c = c.map(i => i.id===id ? {...i, qty:Math.max(0, qty)} : i).filter(i => i.qty>0); writeCart(c); }
  function clearCart(){ writeCart([]); }
  function cartTotal(c=readCart()){ return c.reduce((a,i)=>a+i.precio*i.qty,0); }

  function renderCartBadge(){
    const el = document.querySelector('.cart-count'); if (!el) return;
    const count = readCart().reduce((n,i)=>n+i.qty,0); el.textContent = count;
  }

  function buildCartDrawer(){
    const drawer = document.querySelector('.cart-drawer'); if (!drawer) return;
    const list = drawer.querySelector('.cart-drawer__list');
    const totalEl = drawer.querySelector('.total-chip');
    const emptyMsg = drawer.querySelector('.cart-empty-msg');
    const cart = readCart();
    list.innerHTML = '';
    if (cart.length === 0) emptyMsg.style.display = 'block'; else {
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

    list.querySelectorAll('input.qty-input').forEach(inp => inp.addEventListener('change', () => {
      const id = inp.dataset.id; const qty = Math.max(0, parseInt(inp.value||'0',10)); updateQty(id, qty);
    }));
    list.querySelectorAll('[data-action="del"]').forEach(btn => btn.addEventListener('click', () => updateQty(btn.dataset.id,0)));
  }

  function toggleDrawer(force){
    const drawer = document.querySelector('.cart-drawer');
    const show = typeof force==='boolean' ? force : !(drawer.style.display==='flex');
    drawer.style.display = show ? 'flex' : 'none';
    if (drawer.style.display === 'flex') buildCartDrawer();
  }

  function createFloatingCart(){
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
      // show after scroll
      if (y > 120) btn.classList.add('floating-cart--show');
      else btn.classList.remove('floating-cart--show');

      // autohide header
      const header = document.querySelector('.header');
      if (!header) return;
      if (y > lastY && y > 80) header.classList.add('header--hidden'); else header.classList.remove('header--hidden');
      lastY = y;
    }, { passive: true });
  }

  // Public init for all pages
  function initHeader(){
    initTheme();
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => setTheme(getTheme()==='light' ? 'dark' : 'light'));
    // Language
    window.I18N.applyTranslations();
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
      const next = window.I18N.getLang()==='es' ? 'en' : 'es';
      window.I18N.setLang(next);
    });
    // Cart badges & actions
    renderCartBadge();
    document.getElementById('cart-toggle')?.addEventListener('click', () => toggleDrawer());
    document.addEventListener('cart:updated', () => { renderCartBadge(); buildCartDrawer(); });
    document.addEventListener('click', (e) => {
      const drawer = document.querySelector('.cart-drawer');
      if (!drawer) return;
      const within = drawer.contains(e.target) || e.target.closest('#cart-toggle') || e.target.closest('#floating-cart');
      if (!within && drawer.style.display === 'flex') drawer.style.display = 'none';
    });
    // WhatsApp checkout
    document.getElementById('wa-checkout')?.addEventListener('click', () => {
      const cart = readCart(); if (cart.length===0) return;
      let msg = '¡Hola! Quiero este pedido:%0A%0A';
      cart.forEach(i=> msg += `- ${i.nombre} x${i.qty} = $${(i.precio*i.qty).toFixed(2)}%0A`);
      msg += `%0ATotal: $${cartTotal(cart).toFixed(2)}`;
      const telefono = '17864036850';
      window.open(`https://wa.me/${telefono}?text=${msg}`, '_blank');
    });
    document.getElementById('clear-cart')?.addEventListener('click', () => clearCart());

    // Floating cart + autohide header
    createFloatingCart();
  }

  // Expose some API
  window.Cart = { addToCart };
  window.UI = { initHeader };
})();

// ========= Shop (no modules) =========
(function(){
  const FALLBACK_JSON = [
    {"id":"17","nombre":"Guineo","categoria":"animales","precio":5.50,"imagen":"assets/img/categorias/animales/guineo.jpg","agotado":false},
    {"id":"18","nombre":"Patos Grandes","categoria":"animales","precio":25.99,"imagen":"assets/img/categorias/animales/patos-grandes.jpg","agotado":false},
    {"id":"19","nombre":"Patos Pequeños","categoria":"animales","precio":5.99,"imagen":"assets/img/categorias/animales/patos-pequenos.jpg","agotado":false},
  ];

  async function loadProducts(){
    try {
      const res = await fetch('data/productos.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Network');
      return await res.json();
    } catch(e) {
      console.warn('Usando fallback de productos por CORS/local:', e);
      return FALLBACK_JSON;
    }
  }

  function productHTML(p){
    const agotadoHTML = p.agotado ? `<div class="badge">Agotado</div>` : '';
    const priceHTML = p.precio > 0 ? `<div class="badge">$${p.precio.toFixed(2)}</div>` : `<div class="badge">Consultar</div>`;
    const btnDisabled = p.agotado ? 'disabled' : '';
    return `
    <article class="card" data-cat="${p.categoria}" data-name="${p.nombre.toLowerCase()}">
      <img class="card__img" src="${p.imagen}" alt="${p.nombre}">
      <div class="card__body">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <strong>${p.nombre}</strong>
          ${priceHTML}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <span class="badge">${p.categoria}</span>
          ${agotadoHTML}
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px;">
          <button class="btn btn--primary add-btn" data-id="${p.id}" ${btnDisabled}>
            <i class="fa-solid fa-cart-plus"></i> <span>Agregar</span>
          </button>
          <input type="number" min="1" value="1" class="qty-input qty-input-${p.id}">
        </div>
      </div>
    </article>
    `;
  }

  async function renderShop(){
    const grid = document.querySelector('#shop-grid');
    if (!grid) return;
    const filters = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('#search-input');
    const prods = await loadProducts();
    grid.innerHTML = prods.map(productHTML).join('');
    window.I18N.applyTranslations();

    function applyFilter(){
      const activeBtn = document.querySelector('.filter-btn.active');
      const cat = activeBtn ? activeBtn.dataset.cat : 'todos';
      const q = (searchInput?.value || '').trim().toLowerCase();
      grid.querySelectorAll('.card').forEach(card => {
        const matchCat = (cat === 'todos') || (card.dataset.cat === cat);
        const matchText = !q || card.dataset.name.includes(q);
        card.style.display = (matchCat && matchText) ? '' : 'none';
      });
    }

    // add events
    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const qty = parseInt(document.querySelector(`.qty-input-${id}`).value || '1', 10);
        const p = prods.find(x => x.id === id);
        if (!p || p.agotado) return;
        window.Cart.addToCart(p, Math.max(1, qty));
      });
    });
    filters.forEach(b => b.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      applyFilter();
    }));
    searchInput?.addEventListener('input', applyFilter);

    // URL filter
    const url = new URL(location.href);
    const urlCat = url.searchParams.get('cat');
    if (urlCat) {
      const btn = document.querySelector(`.filter-btn[data-cat="${urlCat}"]`);
      if (btn) btn.click();
    } else {
      applyFilter();
    }
  }

  window.renderShop = renderShop;
})();

// ========= Animated Counters =========
(function(){
  function animate(el){
    const to = parseInt(el.getAttribute('data-counter-to') || '0', 10);
    const dur = parseInt(el.getAttribute('data-counter-dur') || '1200', 10);
    const start = performance.now();
    const from = 0;

    function frame(now){
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = Math.floor(from + (to - from) * eased);
      el.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initCounters(){
    const els = Array.from(document.querySelectorAll('[data-counter-to]'));
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  window.initCounters = initCounters;
})();

// ========= Boot =========
document.addEventListener('DOMContentLoaded', () => {
  window.UI.initHeader();
  window.I18N.applyTranslations();
  window.initCounters();
});

// Toasts
(function(){
  const c = document.createElement('div'); c.className='toast-container'; document.body.appendChild(c);
  function toast(html){ const t=document.createElement('div'); t.className='toast'; t.innerHTML=html; c.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300)},2200); }
  document.addEventListener('cart:added', (e)=> { const {product, qty}=e.detail; toast(`<i class="fa-solid fa-check"></i> ${qty} × ${(product.nombre||'Producto')} añadido`); });
})();
