
// Simple i18n system with data-i18n attributes
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
    'home.reviews': 'Reseñas de clientes',
    'home.stats.title': 'Nuestra Trayectoria',
    'home.stats.years': 'Años de experiencia',
    'home.stats.products': 'Productos vendidos',
    'home.stats.clients': 'Clientes satisfechos',
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
    'home.reviews': 'Customer Reviews',
    'home.stats.title': 'Our Track Record',
    'home.stats.years': 'Years of experience',
    'home.stats.products': 'Products sold',
    'home.stats.clients': 'Happy customers',
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

export function getLang() {
  return localStorage.getItem(I18N_STORAGE_KEY) || 'es';
}

export function setLang(lang) {
  localStorage.setItem(I18N_STORAGE_KEY, lang);
  applyTranslations();
}

export function applyTranslations(root=document) {
  const lang = getLang();
  const dict = MESSAGES[lang] || MESSAGES.es;
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

// i18n extras
MESSAGES.es['product.soldout'] = 'Agotado';
MESSAGES.es['product.add'] = 'Agregar';
MESSAGES.es['filters.sort'] = 'Ordenar:';
MESSAGES.es['filters.sort.name'] = 'Nombre (A-Z)';
MESSAGES.es['filters.sort.price_asc'] = 'Precio (menor a mayor)';
MESSAGES.es['filters.sort.price_desc'] = 'Precio (mayor a menor)';
MESSAGES.es['filters.sort.available'] = 'Disponibles primero';
MESSAGES.en = MESSAGES.en || {};
MESSAGES.en['product.soldout'] = 'Sold out';
MESSAGES.en['product.add'] = 'Add';
MESSAGES.en['filters.sort'] = 'Sort:';
MESSAGES.en['filters.sort.name'] = 'Name (A-Z)';
MESSAGES.en['filters.sort.price_asc'] = 'Price (low to high)';
MESSAGES.en['filters.sort.price_desc'] = 'Price (high to low)';
MESSAGES.en['filters.sort.available'] = 'Available first';

// Map for explicit product translations by id (optional)
window.PRODUCTS_I18N = window.PRODUCTS_I18N || {};

// Helper to get product name per language, falling back to nombre/nombre_en
window.getProductName = function(p){
  const lang = (localStorage.getItem('ebf_lang') || (navigator.language||'es')).slice(0,2);
  const map = (window.PRODUCTS_I18N||{})[p.id];
  if (map && map[lang]) return map[lang];
  if (lang.startsWith('en') && p.nombre_en) return p.nombre_en;
  return p.nombre;
};
