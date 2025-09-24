
import { addToCart } from './cart.js';
import { applyTranslations } from './i18n.js';

const FALLBACK_JSON = [
  {"id":"17","nombre":"Guineo","categoria":"animales","precio":5.50,"imagen":"assets/img/categorias/animales/guineo.jpg","agotado":false},
  {"id":"18","nombre":"Patos Grandes","categoria":"animales","precio":25.99,"imagen":"assets/img/categorias/animales/patos-grandes.jpg","agotado":false},
  {"id":"19","nombre":"Patos Pequeños","categoria":"animales","precio":5.99,"imagen":"assets/img/categorias/animales/patos-pequenos.jpg","agotado":false},
];

export async function loadProducts() {
  try {
    const res = await fetch('data/productos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Network');
    return await res.json();
  } catch(e) {
    console.warn('Usando fallback de productos por CORS/local:', e);
    return FALLBACK_JSON;
  }
}

function productHTML(p) {
  const name = window.getProductName ? window.getProductName(p) : p.nombre;
  const agotadoHTML = p.agotado ? `<div class="badge" data-i18n="product.soldout">Agotado</div>` : '';
  const priceHTML = p.precio > 0 ? `<div class="badge">$${p.precio.toFixed(2)}</div>` : `<div class="badge">Consultar</div>`;
  const btnDisabled = p.agotado ? 'disabled' : '';
  return `
  <article class="card" data-cat="${p.categoria}" data-name="${p.nombre.toLowerCase()}">
    <img class="card__img" src="${p.imagen}" alt="${name}">
    <div class="card__body">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
        <strong>${name}</strong>
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

export async function renderShop() {
  const grid = document.querySelector('#shop-grid');
  const filters = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('#search-input');
  const prods = await loadProducts();
  grid.innerHTML = prods.map(productHTML).join('');
  applyTranslations();

  function applyFilter() {
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
      addToCart(p, Math.max(1, qty));
    });
  });
  filters.forEach(b => b.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    applyFilter();
  }));
  searchInput?.addEventListener('input', applyFilter);

  // If URL has ?cat=animales set filter
  const url = new URL(location.href);
  const urlCat = url.searchParams.get('cat');
  if (urlCat) {
    const btn = document.querySelector(`.filter-btn[data-cat="${urlCat}"]`);
    if (btn) btn.click();
  } else {
    applyFilter();
  }
}


// Re-apply names on language change
document.addEventListener('lang:changed', () => {
  const grid = document.querySelector('#shop-grid');
  if (!grid) return;
  // Update only titles to avoid refetch
  grid.querySelectorAll('.card').forEach(card => {
    const id = card.querySelector('.add-btn')?.dataset.id;
    if (!id) return;
    const nameEl = card.querySelector('strong');
    if (!nameEl) return;
    const prodsEl = Array.from(grid.querySelectorAll('.card'));
  });
  // simplest: re-render whole grid by re-calling renderShop if present
  if (window.renderShop) {
    window.renderShop();
  }
});
