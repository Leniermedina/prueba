// assets/js/translations.js

const translations = {
    es: {
        // === Navegación ===
        "nav.home": "Inicio",
        "nav.shop": "Tienda",
        "nav.about": "Acerca de",
        "nav.contact": "Contacto",

        // === Página de Inicio (index.html) ===
        "home.categories": "Categorías",
        "home.deals": "Ofertas de temporada",
        "home.bestsellers": "Más vendidos",
        "home.need": "Lo que necesitas",
        "home.viewAll": "Ver todo",
        "home.hero.title1": "Grandes Ofertas",
        "home.hero.desc1": "Hasta 50% de descuento en productos seleccionados",
        "home.hero.btn1": "Ver ofertas",
        "home.hero.title2": "Nuevos Productos",
        "home.hero.desc2": "Descubre las últimas novedades en IslaMarket",
        "home.hero.btn2": "Explorar",
        "home.deals.section": "Ofertas de la semana",
        "home.bestsellers.section": "Más vendidos",
        "home.services": "Servicios y envíos",
        "category.addToCart": "Agregar",
        "cart.quantity": "Cantidad:",

        // === Nombres de Categorías en la Página de Inicio ===
        // --- CLAVES AÑADIDAS ---
        "home.cat.todos": "Todos los productos",
        "home.cat.accesorios-deportivos": "Accesorios Deportivos",
        "home.cat.alimentos": "Alimentos",
        "home.cat.electrodomesticos": "Electrodomésticos",
        "home.cat.ropa": "Ropa",
        "home.cat.tecnologia": "Tecnología",
        "home.cat.herramientas": "Herramientas",
        "home.cat.joyeria": "Joyería",
        "home.cat.piezas-para-autos": "Piezas para Autos",
        "home.cat.productos-del-hogar": "Productos del Hogar",
        "home.cat.suplementos-vitaminicos": "Suplementos Vitamínicos",
        "home.cat.servicios": "Servicios",
        // -----------------------

        // === Página de Categorías (categorias.html) ===
        "categories.title": "Categorías",
        "categories.viewAll": "Ver todos los productos",

        // === Página Individual de Categoría (categoria.html) ===
        // --- CLAVES ACTUALIZADAS/COMPLETADAS ---
        "category.title": "Categoría",
        "category.todos": "Todos los productos",
        "category.accesorios-deportivos": "Accesorios Deportivos",
        "category.alimentos": "Alimentos",
        "category.electrodomesticos": "Electrodomésticos",
        "category.ropa": "Ropa",
        "category.tecnologia": "Tecnología",
        "category.herramientas": "Herramientas",
        "category.joyeria": "Joyería",
        "category.piezas-para-autos": "Piezas para Autos",
        "category.productos-del-hogar": "Productos del Hogar",
        "category.suplementos-vitaminicos": "Suplementos Vitamínicos",
        "category.servicios": "Servicios",
        // ----------------------------------------
        "category.backToCategories": "Volver a Categorías",
        "category.sortBy": "Ordenar por:",
        "category.sort.default": "Por defecto",
        "category.sort.priceLow": "Precio: Menor a Mayor",
        "category.sort.priceHigh": "Precio: Mayor a Menor",
        "category.sort.name": "Nombre (A-Z)",
        "category.noProducts": "No se encontraron productos para esta categoría.",
        "category.addToCart": "Agregar",
        "cart.quantity": "Cantidad:",
        // --- NUEVAS CLAVES PARA PRECIO ---
        "category.price.label": "Precio:",
        "category.currency": "US$",
        // -------------------------------

        // === Página Acerca de (acerca-de.html) ===
        "about.title": "Acerca de Nosotros",
        "about.hero.title": "Nuestra Historia",
        "about.hero.desc": "Conectando comunidades con productos de calidad desde 2010.",
        "about.timeline.title": "Línea de Tiempo",
        "about.timeline.founded": "Fundación",
        "about.timeline.founded.desc": "IslaMarket fue fundada con la visión de crear un mercado en línea confiable.",
        "about.timeline.expansion": "Expansión",
        "about.timeline.expansion.desc": "Ampliamos nuestra gama de productos y servicios.",
        "about.timeline.today": "Hoy",
        "about.timeline.today.desc": "Nos esforzamos por seguir siendo su socio preferido.",
        "about.team.title": "Nuestro Equipo",
        "about.team.member1.name": "Juan Pérez",
        "about.team.member1.role": "Director Ejecutivo",
        "about.team.member2.name": "Ana Gómez",
        "about.team.member2.role": "Directora de Tecnología",
        "about.cta.title": "¿Listo para comenzar?",
        "about.cta.desc": "Descubre nuestros productos y servicios diseñados pensando en ti.",
        "about.cta.button": "Explorar Tienda",

        // === Página Contacto (contacto.html) ===
        "contact.title": "Contacto",
        "contact.hero.title": "Contáctanos",
        "contact.hero.desc": "Estamos aquí para ayudarte. Envíanos un mensaje.",
        "contact.form.name": "Nombre",
        "contact.form.email": "Email",
        "contact.form.message": "Mensaje",
        "contact.form.send": "Enviar Mensaje",
        "contact.info.title": "Información de Contacto",
        "contact.info.email": "Email:",
        "contact.info.whatsapp": "WhatsApp:",
        "contact.faq.title": "Preguntas Frecuentes",
        "contact.faq.q1": "¿Cómo puedo realizar un pedido?",
        "contact.faq.a1": "Puedes realizar un pedido directamente desde nuestra tienda en línea.",
        "contact.faq.q2": "¿Cuáles son los métodos de pago?",
        "contact.faq.a2": "Aceptamos pagos en USD a través de transferencias bancarias y otras plataformas seguras.",
        "contact.faq.q3": "¿Cuánto tiempo tarda la entrega?",
        "contact.faq.a3": "El tiempo de entrega varía según la ubicación y el producto. Nos esforzamos por entregar lo más rápido posible.",

        // === Footer ===
        "footer.description": "Tu tienda online confiable con los mejores productos y precios.",
        "footer.menu": "Menú",
        "footer.contact": "Contacto",
        "footer.email": "Email:",
        "footer.whatsapp": "WhatsApp:",
        "footer.copyright": "© 2025 IslaMarket. Todos los derechos reservados.",

        // === Mensajes y Carrito ===
        "message.productAdded": "Producto agregado",
        "message.cartEmpty": "El carrito está vacío", // Mensaje para alerta de carrito vacío
        "cart.empty": "Tu carrito está vacío",
        "cart.total": "Total:",
        "cart.checkout": "Finalizar Compra",
        "cart.removeItem": "Eliminar",
        "cart.title": "Carrito de Compras",
        "cart.close": "Cerrar"
    },
    en: {
        // === Navigation ===
        "nav.home": "Home",
        "nav.shop": "Shop",
        "nav.about": "About",
        "nav.contact": "Contact",

        // === Home Page (index.html) ===
        "home.categories": "Categories",
        "home.deals": "Seasonal Deals",
        "home.bestsellers": "Bestsellers",
        "home.need": "What you need",
        "home.viewAll": "View All",
        "home.hero.title1": "Big Deals",
        "home.hero.desc1": "Up to 50% off on selected products",
        "home.hero.btn1": "See offers",
        "home.hero.title2": "New Products",
        "home.hero.desc2": "Discover the latest novelties at IslaMarket",
        "home.hero.btn2": "Explore",
        "home.deals.section": "Deals of the week",
        "home.bestsellers.section": "Bestsellers",
        "home.services": "Services & Shipping",
        "category.addToCart": "Add",
        "cart.quantity": "Quantity:",

        // === Category Names on Home Page ===
        // --- CLAVES AÑADIDAS ---
        "home.cat.todos": "All Products",
        "home.cat.accesorios-deportivos": "Sports Accessories",
        "home.cat.alimentos": "Food",
        "home.cat.electrodomesticos": "Home Appliances",
        "home.cat.ropa": "Clothing",
        "home.cat.tecnologia": "Technology",
        "home.cat.herramientas": "Tools",
        "home.cat.joyeria": "Jewelry",
        "home.cat.piezas-para-autos": "Car Parts",
        "home.cat.productos-del-hogar": "Home Products",
        "home.cat.suplementos-vitaminicos": "Vitamins & Supplements",
        "home.cat.servicios": "Services",
        // -----------------------

        // === Categories Page (categorias.html) ===
        "categories.title": "Categories",
        "categories.viewAll": "View all products",

        // === Individual Category Page (categoria.html) ===
        // --- CLAVES ACTUALIZADAS/COMPLETADAS ---
        "category.title": "Category",
        "category.todos": "All Products",
        "category.accesorios-deportivos": "Sports Accessories",
        "category.alimentos": "Food",
        "category.electrodomesticos": "Home Appliances",
        "category.ropa": "Clothing",
        "category.tecnologia": "Technology",
        "category.herramientas": "Tools",
        "category.joyeria": "Jewelry",
        "category.piezas-para-autos": "Car Parts",
        "category.productos-del-hogar": "Home Products",
        "category.suplementos-vitaminicos": "Vitamins & Supplements",
        "category.servicios": "Services",
        // ----------------------------------------
        "category.backToCategories": "Back to Categories",
        "category.sortBy": "Sort by:",
        "category.sort.default": "Default",
        "category.sort.priceLow": "Price: Low to High",
        "category.sort.priceHigh": "Price: High to Low",
        "category.sort.name": "Name (A-Z)",
        "category.noProducts": "No products found for this category.",
        "category.addToCart": "Add",
        "cart.quantity": "Quantity:",
        // --- NUEVAS CLAVES PARA PRECIO ---
        "category.price.label": "Price:",
        "category.currency": "USD",
        // -------------------------------

        // === About Page (acerca-de.html) ===
        "about.title": "About Us",
        "about.hero.title": "Our Story",
        "about.hero.desc": "Connecting communities with quality products since 2010.",
        "about.timeline.title": "Timeline",
        "about.timeline.founded": "Foundation",
        "about.timeline.founded.desc": "IslaMarket was founded with the vision of creating a reliable online marketplace.",
        "about.timeline.expansion": "Expansion",
        "about.timeline.expansion.desc": "We expanded our range of products and services.",
        "about.timeline.today": "Today",
        "about.timeline.today.desc": "We strive to remain your preferred partner.",
        "about.team.title": "Our Team",
        "about.team.member1.name": "Juan Pérez",
        "about.team.member1.role": "Chief Executive Officer",
        "about.team.member2.name": "Ana Gómez",
        "about.team.member2.role": "Chief Technology Officer",
        "about.cta.title": "Ready to get started?",
        "about.cta.desc": "Discover our products and services designed with you in mind.",
        "about.cta.button": "Explore Shop",

        // === Contact Page (contacto.html) ===
        "contact.title": "Contact",
        "contact.hero.title": "Get In Touch",
        "contact.hero.desc": "We are here to help. Send us a message.",
        "contact.form.name": "Name",
        "contact.form.email": "Email",
        "contact.form.message": "Message",
        "contact.form.send": "Send Message",
        "contact.info.title": "Contact Information",
        "contact.info.email": "Email:",
        "contact.info.whatsapp": "WhatsApp:",
        "contact.faq.title": "Frequently Asked Questions",
        "contact.faq.q1": "How can I place an order?",
        "contact.faq.a1": "You can place an order directly from our online store.",
        "contact.faq.q2": "What are the payment methods?",
        "contact.faq.a2": "We accept payments in USD through bank transfers and other secure platforms.",
        "contact.faq.q3": "How long does delivery take?",
        "contact.faq.a3": "Delivery time varies depending on location and product. We strive to deliver as quickly as possible.",

        // === Footer ===
        "footer.description": "Your reliable online store with the best products and prices.",
        "footer.menu": "Menu",
        "footer.contact": "Contact",
        "footer.email": "Email:",
        "footer.whatsapp": "WhatsApp:",
        "footer.copyright": "© 2025 IslaMarket. All rights reserved.",

        // === Messages & Cart ===
        "message.productAdded": "Product added",
        "message.cartEmpty": "The cart is empty", // Mensaje para alerta de carrito vacío
        "cart.empty": "Your cart is empty",
        "cart.total": "Total:",
        "cart.checkout": "Checkout",
        "cart.removeItem": "Remove",
        "cart.title": "Shopping Cart",
        "cart.close": "Close"
    }
};

// Función para obtener la traducción
function getTranslation(key, lang = 'es') {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
}

// Función para aplicar las traducciones
function applyTranslations(lang) {
    // Traducir elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        if (element.placeholder !== undefined) {
            element.placeholder = translation;
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
             // Para inputs, textareas y selects, manejar value o textContent según el tipo
             if (element.type === 'submit' || element.type === 'button' || element.tagName === 'SELECT') {
                 // Para botones submit, button y selects, usar textContent o value
                 if (element.tagName === 'OPTION') {
                     element.textContent = translation;
                 } else {
                     element.value = translation;
                 }
             } else {
                 element.value = translation;
             }
        } else {
            element.textContent = translation;
        }
    });

    // Traducir atributos específicos si es necesario
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        element.setAttribute('aria-label', getTranslation(key, lang));
    });

    // Traducir placeholders de inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.setAttribute('placeholder', getTranslation(key, lang));
    });
    
    // Traducir valores de inputs tipo submit/button si tienen data-i18n
    document.querySelectorAll('input[type="submit"][data-i18n], button[data-i18n], input[type="button"][data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.value = getTranslation(key, lang);
    });
    
    // Traducir textos de las opciones del select
    document.querySelectorAll('option[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getTranslation(key, lang);
    });
}

// Hacer las funciones accesibles globalmente
window.translations = translations;
window.getTranslation = getTranslation;
window.applyTranslations = applyTranslations;
