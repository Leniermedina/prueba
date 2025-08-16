'use client';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@lib/i18n';
import { toast } from './Toast';
type Item = { productId: string; name: string; price: number; qty: number };
type Cart = { items: Item[]; subtotal: number };
export default function CartClient() {
  const { t, dict } = useI18n();
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0 });
  const load = async () => { const r = await fetch('/api/cart', { cache: 'no-store' }); const j = await r.json(); setCart(j); };
  useEffect(() => { load(); }, []);
  const update = async (it: Item, qty: number) => { const r = await fetch('/api/cart', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ ...it, qty }) }); if (r.ok) { const j = await r.json(); setCart(j); } else { toast(t('cart.error')); } };
  const remove = async (productId: string) => { const r = await fetch(`/api/cart/${productId}`, { method: 'DELETE' }); if (r.ok) { const j = await r.json(); setCart(j); } else { toast(t('cart.error')); } };
  const message = useMemo(() => { const lines = cart.items.map(i => `• ${i.name} x${i.qty} – $${(i.price * i.qty).toFixed(2)}`); lines.push(`${dict['cart.total']}: $${cart.subtotal.toFixed(2)}`); return encodeURIComponent(lines.join('\n')); }, [cart, dict]);
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE as string | undefined) || (process.env.WHATSAPP_PHONE as string | undefined) || '17863952896';
  const link = `https://wa.me/${phone}?text=${message}`;
  return (<div className="cart">{cart.items.length === 0 && <p className="muted">{t('cart.empty')}</p>}{cart.items.map((i)=>(<article key={i.productId} className="row card"><div className="grow"><strong>{i.name}</strong><p className="muted">${i.price.toFixed(2)} · {t('cart.qty')} {i.qty}</p></div><div className="row"><button className="btn small" onClick={()=>update(i, Math.max(0, i.qty-1))}>−</button><button className="btn small" onClick={()=>update(i, i.qty+1)}>+</button><button className="btn btn-danger small" onClick={()=>remove(i.productId)}>{t('common.remove')}</button></div></article>))}<div className="cart-total"><strong>{t('cart.total')}: </strong> ${cart.subtotal.toFixed(2)}</div><a className="btn btn-primary" href={link} target="_blank" rel="noreferrer">{t('cart.order_now')}</a></div>);
}