
import { addToCart } from './cart.js';
import { applyTranslations } from './i18n.js';

/** Load products from JSON (no-cache) with graceful fallback */
export async function loadProducts() {
  try {
    const res = await fetch('data/productos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Network');
    return await res.json();
  } catch (e) {
    console.warn('Fallo al cargar productos:', e);
    return [];
  }
}

/** Build a single product card (glass style) */
function productHTML(p) {
  const name = (window.getProductName ? window.getProductName(p) : p.nombre) || '';
  const agotado = !!p.agotado;

  const priceHTML = (p.precio > 0)
    ? `<span class="price-badge">$${Number(p.precio).toFixed(2)}</span>`
    : ``;

  const stockHTML = agotado
    ? `<div class="stock-row"><i class="fa-regular fa-circle-xmark"></i><span data-i18n="stock.soldout">Agotado</span></div>`
    : `<div class="stock-row"><i class="fa-solid fa-circle-check"></i><span data-i18n="stock.available">Disponible</span></div>`;

  const actionsHTML = agotado ? `` : `
    <div class="actions-row">
      <button class="add-btn btn-3d" data-id="${p.id}" title="${name}">
        <i class="fa-solid fa-cart-plus"></i>
      </button>
      <div class=\"qty-stepper\"><button class=\"step minus\" data-id=\"${p.id}\" aria-label=\"-\">−</button><input type=\"number\" min=\"0\" value=\"0\" class=\"qty-input qty-input-${p.id}\" inputmode=\"numeric\"><button class=\"step plus\" data-id=\"${p.id}\" aria-label=\"+\">+</button></div>
    </div>`;

  return `
  <article class="card product-card" data-cat="${p.categoria}" data-name="${name.toLowerCase()}">
    <div class="card__media">
      <img src="${p.imagen}" alt="${name}">
      ${priceHTML}
    </div>
    <div class="card__glass">
      <h3 class="p-name">${name}</h3>
      <span class="category-pill">${p.categoria}</span>
      ${stockHTML}
      ${actionsHTML}
    </div>
  </article>`;
}

/** Render shop grid, add sorting/filtering and interactions */
export async function renderShop() {
  const grid = document.querySelector('#shop-grid');
  if (!grid) return;

  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const searchInput = document.querySelector('#search-input');
  const sortSel = document.querySelector('#sort-select');

  const data = await loadProducts();

  function renderList(list) {
    grid.innerHTML = list.map(productHTML).join('');
    applyTranslations();

    // Bind add-to-cart
    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const qty = parseInt(document.querySelector(`.qty-input-${CSS.escape(id)}`)?.value || '0', 10);
        const p = data.find(x => String(x.id) === String(id));
        if (!p || p.agotado) return;
        addToCart(p, Math.max(1, qty));
      });
    });

    // Autosize qty pills
    grid.querySelectorAll('.qty-input').forEach(inp => {
      const autosize = () => { const l = String(inp.value || '0').length; inp.style.width = Math.max(32, 16 + l * 10) + 'px'; };
      autosize(); inp.addEventListener('input', autosize);
    });
    // Stepper +/-
    grid.querySelectorAll('.qty-stepper .step').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const input = grid.querySelector(`.qty-input-${CSS.escape(id)}`);
        if (!input) return;
        const cur = parseInt(input.value || '0', 10) || 0;
        const next = btn.classList.contains('plus') ? cur + 1 : Math.max(0, cur - 1);
        input.value = next;
        const e = new Event('input'); input.dispatchEvent(e);
      });
    });
  }
function sortData(mode, src) {
    const arr = src.slice();
    if (mode === 'name-asc')  arr.sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||''));
    if (mode === 'price-asc') arr.sort((a,b)=> (Number(a.precio)||0)-(Number(b.precio)||0));
    if (mode === 'price-desc')arr.sort((a,b)=> (Number(b.precio)||0)-(Number(a.precio)||0));
    if (mode === 'available') arr.sort((a,b)=> (a.agotado===b.agotado?0:(a.agotado?1:-1)) || (a.nombre||'').localeCompare(b.nombre||''));
    return arr;
  }

  function applyFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const cat = activeBtn ? activeBtn.dataset.cat : 'todos';
    const q = (searchInput?.value || '').trim().toLowerCase();
    grid.querySelectorAll('.product-card').forEach(card => {
      const matchCat = (cat === 'todos') || (card.dataset.cat === cat);
      const matchText = !q || card.dataset.name.includes(q);
      card.style.display = (matchCat && matchText) ? '' : 'none';
    });
  }

  // Initial render sorted by selection (default name-asc)
  const initial = sortData(sortSel?.value || 'name-asc', data);
  renderList(initial);
  applyFilter();

  // Events
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter();
  }));
  searchInput?.addEventListener('input', applyFilter);
  sortSel?.addEventListener('change', () => {
    const sorted = sortData(sortSel.value, data);
    renderList(sorted);
    applyFilter();
  });

  // URL ?cat=
  const urlCat = new URL(location.href).searchParams.get('cat');
  if (urlCat) document.querySelector(`.filter-btn[data-cat="${urlCat}"]`)?.click();
}

// Auto-run fallback if loaded directly
if (window.AUTO_INIT_SHOP) { renderShop(); }
