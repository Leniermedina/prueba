
import { addToCart } from './cart.js';
import { applyTranslations } from './i18n.js';

const FALLBACK_JSON = [];

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

function productHTML(p){
  const name = window.getProductName ? window.getProductName(p) : p.nombre;
  const agotado = !!p.agotado;
  const priceHTML = (p.precio>0) ? `<div class="badge price-badge">$${p.precio.toFixed(2)}</div>` : ``;
  const soldHTML = agotado ? `<div class="badge" data-i18n="product.soldout">Agotado</div>` : ``;
  const actions = agotado ? `` : `<div class="actions">
        <button class="icon-btn btn-3d add-btn" data-id="${p.id}" title="${name}"><i class="fa-solid fa-cart-plus"></i></button>
        <input type="number" min="0" value="0" class="qty-input qty-input-${p.id}" inputmode="numeric">
      </div>`;
  return `<article class="card product-card" data-cat="${p.categoria}" data-name="${name.toLowerCase()}">
    <img class="card__img" src="${p.imagen}" alt="${name}">
    <div class="card__body">
      <div class="line1"><strong class="p-name">${name}</strong>${priceHTML}</div>
      <div class="line2"><span class="badge">${p.categoria}</span>${soldHTML}</div>
      ${actions}
    </div>
  </article>`;
}

export async function renderShop(){
  const grid = document.querySelector('#shop-grid');
  const filters = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('#search-input');
  const sortSel = document.querySelector('#sort-select');
  const prods = await loadProducts();
  let data = prods.slice();

  function renderList(list){
    grid.innerHTML = list.map(productHTML).join('');
    applyTranslations();
    // Add-to-cart
    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const qty = parseInt(document.querySelector(`.qty-input-${id}`)?.value || '0', 10);
        const p = data.find(x => x.id === id);
        if (!p || p.agotado) return;
        addToCart(p, Math.max(1, qty));
      });
    });
    // Autosize qty
    grid.querySelectorAll('.qty-input').forEach(inp => {
      const autosize = () => { const l=String(inp.value||'0').length; inp.style.width = Math.max(32, 14 + l*10) + 'px'; };
      autosize(); inp.addEventListener('input', autosize);
    });
  }

  // Sorting
  function sortData(mode){
    const arr = data.slice();
    if (mode === 'name-asc')  arr.sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||''));
    if (mode === 'price-asc') arr.sort((a,b)=> (a.precio||0)-(b.precio||0));
    if (mode === 'price-desc') arr.sort((a,b)=> (b.precio||0)-(a.precio||0));
    if (mode === 'available') arr.sort((a,b)=> (a.agotado===b.agotado?0:(a.agotado?1:-1)) || (a.nombre||'').localeCompare(b.nombre||''));
    return arr;
  }

  // Filter (category + text)
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

  // Init render
  renderList(sortData(sortSel?.value || 'name-asc'));
  applyFilter();

  // Events
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); applyFilter();
  }));
  searchInput?.addEventListener('input', applyFilter);
  sortSel?.addEventListener('change', () => { renderList(sortData(sortSel.value)); applyFilter(); });

  // URL ?cat=
  const url = new URL(location.href);
  const urlCat = url.searchParams.get('cat');
  if (urlCat) document.querySelector(`.filter-btn[data-cat="${urlCat}"]`)?.click();
}
