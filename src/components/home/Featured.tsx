import ProductGrid from '@/components/products/ProductGrid';
import { kv } from '@vercel/kv';
export default async function Featured(){
  const ids = await kv.smembers<string>('products:index');
  const list: any[] = [];
  for (const id of ids.slice(0,6)){
    const p = await kv.hgetall<any>(`product:${id}`);
    if (p?.featured) list.push(p);
  }
  return (<section className="container mx-auto p-6"><h2 className="text-2xl font-bold text-brand mb-4">Destacados</h2><ProductGrid products={list} /></section>);
}
