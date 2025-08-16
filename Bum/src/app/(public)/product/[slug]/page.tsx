import { kv } from '@vercel/kv';
import Link from 'next/link';
import Image from 'next/image';
export const revalidate = 60;
export default async function ProductPage({ params }: { params: { slug: string } }){
  const id = await kv.get<string>(`product:slug:${params.slug}`);
  if (!id) return (<section className="container mx-auto p-6"><h1 className="text-3xl font-bold text-brand mb-4">Producto no encontrado</h1><Link className="link" href="/products">Volver a productos</Link></section>);
  const product = await kv.hgetall<any>(`product:${id}`);
  return (<section className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
    <div className="card"><div className="relative w-full aspect-square"><Image src={product.images?.[0] || '/og-image.png'} alt={product.name} fill className="object-cover rounded-xl"/></div></div>
    <div className="card space-y-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl text-brand font-semibold">${product.price.toFixed(2)}</p>
      <p className="text-sm text-zinc-400">{product.description}</p>
      <form action="/api/cart" method="post" className="flex items-center gap-3">
        <input type="hidden" name="productId" value={product.id} />
        <label className="text-sm">Cantidad</label>
        <input name="qty" type="number" min="1" defaultValue="1" className="input w-28" />
        <button className="btn btn-primary" type="submit">Agregar al carrito</button>
      </form>
      <p className="text-sm">Stock: {product.stock}</p>
    </div>
  </section>);
}
