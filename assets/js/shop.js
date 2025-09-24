
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
  const name = (window.getProductName ? window.getProductName(p) : p.nombre);
  const agotado = !!p.agotado;
  const priceHTML = (p.precio > 0) ? `<div class="badge price-badge">$${p.precio.toFixed(2)}</div>` : ``;
  const soldHTML = agotado ? `<div class="badge" data-i18n="product.soldout">Agotado</div>` : ``;

  const actions = agotado ? `` : `
    <div class="actions">
      <button class="btn btn--primary btn-3d add-btn" data-id="${p.id}">
        <i class="fa-solid fa-cart-plus"></i> <span data-i18n="product.add">Agregar</span>
      </button>
      <input type="number" min="1" value="1" class="qty-input qty-input-${p.id}" inputmode="numeric">
    </div>
  `;

  return `
  <article class="card product-card" data-cat="${p.categoria}" data-name="${name.toLowerCase()}">
    <img class="card__img" src="${p.imagen}" alt="${name}">
    <div class="card__body">
      <div class="line1">
        <strong class="p-name">${name}</strong>
        ${priceHTML}
      </div>
      <div class="line2">
        <span class="badge">${p.categoria}</span>
        ${soldHTML}
      </div>
      ${actions}
    </div>
  </article>`;
}
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
  
  let data = prods.slice();

  function renderList(list){
    grid.innerHTML = list.map(productHTML).join('');
    // i18n on dynamic nodes
    applyTranslations();
    // attach add-to-cart and autosize
    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const qty = parseInt(document.querySelector(`.qty-input-${id}`)?.value || '1', 10);
        const p = data.find(x => x.id === id);
        if (!p || p.agotado) return;
        addToCart(p, Math.max(1, qty));
      });
    });
    grid.querySelectorAll('.qty-input').forEach(inp => {
      autosizeQty(inp);
      inp.addEventListener('input', () => autosizeQty(inp));
    });
  }

  // initial render
  renderList(data);


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


// autosize qty inputs for product grid
function autosizeQty(el){
  const len = String(el.value || '1').length;
  el.style.width = Math.max(28, 14 + len*10) + 'px';
}

  // Sorting
  const sortSel = document.querySelector('#sort-select');
  function sortData(mode){
    const arr = data.slice();
    if (mode === 'name-asc') arr.sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||''));
    if (mode === 'price-asc') arr.sort((a,b)=> (a.precio||0)-(b.precio||0));
    if (mode === 'price-desc') arr.sort((a,b)=> (b.precio||0)-(a.precio||0));
    if (mode === 'available') arr.sort((a,b)=> (a.agotado===b.agotado?0:(a.agotado?1:-1)) || (a.nombre||'').localeCompare(b.nombre||''));
    return arr;
  }
  sortSel?.addEventListener('change', ()=> {
    renderList(sortData(sortSel.value));
    applyFilter();
  });
