import Image from 'next/image';
import Link from 'next/link';
export default function ProductGrid({ products }: { products: any[] }){
  if (!products || products.length===0) return <p className="card">No hay productos.</p>;
  return (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map(p => (<article key={p.id} className="card">
      <div className="relative w-full aspect-square mb-3"><Image src={p.images?.[0] || '/og-image.png'} alt={p.name} fill className="object-cover rounded-lg"/></div>
      <h3 className="font-semibold">{p.name}</h3><p className="text-brand">${p.price.toFixed(2)}</p>
      <div className="mt-3 flex items-center gap-2">
        <input className="input w-24" type="number" min="0" defaultValue={0} onChange={(e)=>{
          const qty = Number(e.currentTarget.value);
          const addBtn = e.currentTarget.parentElement?.querySelector('a.add-btn') as HTMLAnchorElement | null;
          if (addBtn) addBtn.style.display = qty>0?'inline-flex':'none';
        }}/>
        <Link href={`/product/${p.slug}`} className="btn">Ver</Link>
        <a style={{display:'none'}} className="btn btn-primary add-btn" href={`/api/cart?productId=${p.id}&qty=1`}>Agregar</a>
      </div>
    </article>))}
  </div>);
}
