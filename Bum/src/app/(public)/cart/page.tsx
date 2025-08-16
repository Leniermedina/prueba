'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
export default function CartPage(){
  const [cart, setCart] = useState<{ items: any[]; subtotal: number }>({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ fetch('/api/cart').then(r=>r.json()).then(setCart).finally(()=>setLoading(false)); },[]);
  const update = async (productId: string, qty: number) => {
    if (qty < 1) return remove(productId);
    const res = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, qty }) });
    if (!res.ok) return toast.error('No se pudo actualizar');
    const next = await res.json(); setCart(next);
  };
  const remove = async (productId: string) => {
    const res = await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
    if (!res.ok) return toast.error('No se pudo eliminar');
    const next = await res.json(); setCart(next);
  };
  const order = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const msg = encodeURIComponent(`Hola, quiero este pedido:\n\n${cart.items.map(i => `${i.name} x ${i.qty} = $${(i.price * i.qty).toFixed(2)}`).join('\n')}\n\nTotal: $${cart.subtotal.toFixed(2)}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };
  if (loading) return <p className="p-6">Cargando carrito...</p>;
  return (<section className="container mx-auto p-6">
    <h1 className="text-3xl font-bold text-brand mb-4">Tu Carrito</h1>
    {cart.items.length === 0 ? (<p className="card">Tu carrito está vacío.</p>) : (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {cart.items.map(it => (
            <div key={it.productId} className="card flex items-center justify-between">
              <div><p className="font-medium">{it.name}</p><p className="text-sm text-zinc-400">${it.price.toFixed(2)} c/u</p></div>
              <div className="flex items-center gap-2">
                <button onClick={() => update(it.productId, it.qty - 1)} className="btn">-</button>
                <span>{it.qty}</span>
                <button onClick={() => update(it.productId, it.qty + 1)} className="btn">+</button>
                <button onClick={() => remove(it.productId)} className="btn">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <aside className="card space-y-2">
          <p className="text-xl">Subtotal: <span className="font-bold">${cart.subtotal.toFixed(2)}</span></p>
          <button onClick={order} className="btn btn-primary w-full">Ordenar por WhatsApp</button>
        </aside>
      </div>
    )}
  </section>);
}
