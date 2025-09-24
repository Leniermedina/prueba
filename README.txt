# El Bosque Farm — Rutas de imágenes
Reemplaza estos archivos con tus imágenes finales (mismas rutas y nombres):

| Sección | Ruta | Sugerencia de tamaño |
|---|---|---|
| **Cabecera (todas las páginas)** | `assets/img/headers/header.jpg` | 2000×600 (JPG/WEBP) |
| **Hero del inicio** | `assets/img/headers/home-hero.jpg` | 1920×1080 (JPG/WEBP) |
| **Categoría: Animales (tile)** | `assets/img/categorias/animales.jpg` | 1600×900 |
| **Categoría: Árboles Frutales (tile)** | `assets/img/categorias/frutales.jpg` | 1600×900 |
| **Categoría: Ornamentales (tile)** | `assets/img/categorias/ornamentales.jpg` | 1600×900 |
| **Trayectoria — Años** | `assets/img/stats/years.jpg` | 1600×900 |
| **Trayectoria — Productos** | `assets/img/stats/products.jpg` | 1600×900 |
| **Trayectoria — Clientes** | `assets/img/stats/clients.jpg` | 1600×900 |

> Los productos individuales siguen leyendo sus rutas dentro de `data/productos.json` (campo `"imagen"`).

## Traducciones de productos
- Opción 1: Añade `"nombre_en"` por producto en `data/productos.json`.
- Opción 2: En `assets/js/i18n.js`, usa `window.PRODUCTS_I18N` mapeado por `id`:
```js
window.PRODUCTS_I18N = {
  "1": { en: "Organic Creole Eggs", es: "Huevos criollos orgánicos" },
  "2": { en: "Chicks", es: "Pollitos" },
};
```
