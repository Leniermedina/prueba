import { kv } from '@vercel/kv';
export default async function sitemap(){
  const base = 'https://prueba-wine-seven.vercel.app';
  const ids = await kv.smembers<string>('products:index');
  const productUrls = await Promise.all(ids.map(async id => {
    const p = await kv.hgetall<any>(`product:${id}`); if (!p) return null;
    return { url: `${base}/product/${p.slug}`, lastModified: new Date(p.updatedAt || Date.now()) };
  }));
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...(productUrls.filter(Boolean) as any[])
  ];
}
