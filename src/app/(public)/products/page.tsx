'use client';
import { useEffect, useState } from 'react';
import CategoryTabs from '@/components/products/CategoryTabs';
import ProductGrid from '@/components/products/ProductGrid';
import WhatsAppFab from '@/components/misc/WhatsAppFab';
type Category = 'moviles' | 'accesorios' | 'covers';
export default function ProductsPage(){
  const [active, setActive] = useState<Category>('moviles');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ setLoading(true); fetch(`/api/products?category=${active}`).then(r=>r.json()).then(setProducts).finally(()=>setLoading(false)); },[active]);
  return (<section className="container mx-auto p-6">
    <h1 className="text-3xl font-bold text-brand mb-4">Productos</h1>
    <CategoryTabs active={active} onChange={setActive} />
    {loading ? <p className="py-8">Cargando productos...</p> : <ProductGrid products={products} />}
    <WhatsAppFab />
  </section>);
}
