
# El Bosque Farm — entrega estática

- Abre `index.html` o `productos.html` desde un servidor local (recomendado) para que la lectura de `data/productos.json` no sea bloqueada por el navegador.
- Si abres con `file://` y falla el fetch, la tienda usará un **fallback** con 3 productos para que puedas probar el carrito.
- Traducción ES/EN con el botón de idioma (globo). Tema claro/oscuro con el botón de media luna.
- Carrito global persistente en `localStorage`, accesible desde cualquier página.
- Edita `data/productos.json` para administrar el catálogo (id, nombre, categoria, precio, imagen, agotado).
