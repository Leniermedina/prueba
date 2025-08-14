
# Proyecto listo para Vercel

Estructura:
```
/public           -> HTML estático
/api              -> Rutas serverless (products, upload, images)
vercel.json       -> Config de builds y rutas
package.json      -> Dependencias para KV y Blob
```

## Variables de entorno (Vercel → Settings → Environment Variables)

- `ADMIN_TOKEN` (token para proteger /api/products)
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `BLOB_READ_WRITE_TOKEN` (necesario para `@vercel/blob` si usas tokens de servidor)

## Endpoints

- `GET  /api/products` (requiere Authorization: Bearer $ADMIN_TOKEN)
- `POST /api/products` (body JSON, requiere Authorization)
- `PUT  /api/products` (body JSON con `id`, requiere Authorization)
- `DELETE /api/products?id=...` (requiere Authorization)
- `POST /api/upload` (form-data con `file`)

## Despliegue

1. Sube este folder al repositorio (GitHub/GitLab/Bitbucket).
2. Conecta el repo en Vercel y añade las variables de entorno.
3. Deploy y listo.

Generado: 2025-08-14T13:37:07.558948
