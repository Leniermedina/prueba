'use client';
import { useEffect, useState } from 'react';
export default function WhatsAppButton() {
  const [href, setHref] = useState('#');
  useEffect(() => { (async ()=>{ const r = await fetch('/api/cart', { cache: 'no-store' }); const j = await r.json(); const lines = (j.items || []).map((i: any) => `• ${i.name} x${i.qty} – $${(i.price*i.qty).toFixed(2)}`); lines.push(`Total: $${(j.subtotal || 0).toFixed(2)}`); const text = encodeURIComponent(lines.join('\n')); const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || (process.env as any).WHATSAPP_PHONE || '17863952896'; setHref(`https://wa.me/${phone}?text=${text}`); })(); }, []);
  return (<a className="whatsapp" href={href} target="_blank" aria-label="WhatsApp" rel="noreferrer">🟢</a>);
}