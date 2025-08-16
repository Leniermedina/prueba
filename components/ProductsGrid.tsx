'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@lib/i18n';
import QuantityInput from './QuantityInput';
import { toast } from './Toast';
type Product = { id: string; name: string; price: number; category: 'moviles'|'covers'|'accesorios'; imageUrl?: string; };
export default function ProductsGrid({ category, take = 12 }: { category?: Product['category']; take?: number }) {
  const { t } = useI18n();
  const [items, setItems] = useState<Product[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const load = async () => { const url = new URL('/api/products', window.location.origin); if (category) url.searchParams.set('category', category); url.searchParams.set('take', String(take)); const r = await fetch(url.toString(), { cache: 'no-store' }); const j = await r.json(); setItems(j.items || []); };
  useEffect(() => { load(); }, [category]);
  const add = async (p: Product) => {
    const q = qty[p.id] || 0;
    const r = await fetch('/api/cart', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: p.id, name: p.name, price: p.price, qty: q }) });
    if (r.ok) toast(t('cart.updated')); else toast(t('auth.error.invalid_credentials'));
  };
  return (<div className="grid">{items.length === 0 && <p className="muted">{t('products.empty')}</p>}{items.map((p)=>(<article key={p.id} className="card">{p.imageUrl && <img src={p.imageUrl} alt={p.name} className="cover" />}<h3>{p.name}</h3><p className="price">${p.price.toFixed(2)}</p><QuantityInput value={qty[p.id] || 0} onChange={(v)=>setQty({...qty, [p.id]: v})} /><button className="btn btn-secondary" onClick={()=>add(p)}>{'Añadir'}</button></article>))}</div>);
}