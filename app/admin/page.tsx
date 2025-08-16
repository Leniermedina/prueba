'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@lib/i18n';
import Input from '@components/Input';
import Button from '@components/Button';
import { toast } from '@components/Toast';
type Product = { id: string; name: string; price: number; category: 'moviles'|'covers'|'accesorios'; imageUrl?: string; };
export default function AdminPage() {
  const { t } = useI18n();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminPass, setAdminPass] = useState('');
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{name:string; price:string; category:Product['category']; image?: File}>({ name: '', price: '', category: 'moviles' });
  const check = async () => { const r = await fetch('/api/session', { cache: 'no-store' }); const j = await r.json(); setIsAdmin(!!j.isAdmin); };
  useEffect(() => { check(); }, []);
  const adminLogin = async (e: React.FormEvent) => { e.preventDefault(); const r = await fetch('/api/auth/admin-login', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ password: adminPass })}); if (r.ok) { toast(t('admin.unlocked')); setIsAdmin(true); load(); } else { toast(t('admin.denied')); } };
  const load = async () => { const r = await fetch('/api/products?take=100'); const j = await r.json(); setList(j.items || []); };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { const fd = new FormData(); fd.set('name', form.name); fd.set('price', form.price); fd.set('category', form.category); if (form.image) fd.set('image', form.image); const r = await fetch('/api/products', { method: 'POST', body: fd }); if (!r.ok) throw new Error(); toast(t('admin.created')); setForm({ name:'', price:'', category:'moviles' }); load(); } catch { toast(t('admin.error')); } finally { setLoading(false); } };
  const remove = async (id: string) => { if (!confirm(t('admin.confirm_delete'))) return; const r = await fetch(`/api/products/${id}`, { method: 'DELETE' }); if (r.ok) { toast(t('admin.deleted')); setList((x) => x.filter(p => p.id !== id)); } else { toast(t('admin.error')); } };
  if (!isAdmin) return (<section className="auth"><div className="auth-card"><h1 className="page-title">{t('admin.title')}</h1><form onSubmit={adminLogin} className="form"><Input type="password" name="admin" label={t('admin.password')} value={adminPass} onChange={(e)=>setAdminPass(e.target.value)} required /><Button type="submit">{t('admin.unlock')}</Button></form></div></section>);
  return (<section><h1 className="page-title">{t('admin.dashboard')}</h1><form onSubmit={submit} className="form grid2"><Input label={t('product.name')} value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required /><Input label={t('product.price')} type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} required /><label className="label">{t('product.category')}<select value={form.category} onChange={(e)=>setForm({...form, category: e.target.value as any})} className="input"><option value="moviles">{t('products.mobiles')}</option><option value="covers">{t('products.covers')}</option><option value="accesorios">{t('products.accessories')}</option></select></label><label className="label">{t('product.image')}<input type="file" accept="image/*" onChange={(e)=>setForm({...form, image: e.target.files?.[0]})} className="input" /></label><div className="full"><Button type="submit" disabled={loading}>{loading? t('common.loading'): t('admin.create')}</Button></div></form><div className="grid">{list.map((p) => (<article key={p.id} className="card">{p.imageUrl && <img src={p.imageUrl} alt={p.name} className="cover" />}<h3>{p.name}</h3><p>${p.price.toFixed(2)}</p><p><small>{p.category}</small></p><div className="row"><a href={`/productos?category=${p.category}`} className="btn btn-secondary">{t('common.view')}</a><button onClick={()=>remove(p.id)} className="btn btn-danger">{t('common.remove')}</button></div></article>))}</div></section>);
}