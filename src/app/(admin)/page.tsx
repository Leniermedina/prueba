'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
export default function AdminPage(){
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: '', slug: '', price: 0, category: 'moviles', description: '', stock: 0, images: [] });
  const fetchProducts = () => fetch('/api/products').then(r => r.json()).then(setProducts);
  useEffect(()=>{ fetchProducts(); },[]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if (!res.ok) return toast.error('No se pudo crear');
    toast.success('Producto creado');
    (e.target as HTMLFormElement).reset();
    setForm({ name: '', slug: '', price: 0, category: 'moviles', description: '', stock: 0, images: [] });
    fetchProducts();
  };
  const onDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) return toast.error('No se pudo eliminar');
    toast.success('Eliminado'); fetchProducts();
  };

  return (<section className="container mx-auto p-6 space-y-6">
    <h1 className="text-3xl font-bold text-brand">Panel Admin</h1>
    <form onSubmit={onCreate} className="card grid md:grid-cols-2 gap-4">
      <input className="input" placeholder="Nombre" onChange={e=>setForm({...form, name: e.target.value})} required />
      <input className="input" placeholder="Slug" onChange={e=>setForm({...form, slug: e.target.value})} required />
      <input className="input" type="number" placeholder="Precio" onChange={e=>setForm({...form, price: Number(e.target.value)})} required />
      <select className="input" onChange={e=>setForm({...form, category: e.target.value})}>
        <option value="moviles">moviles</option>
        <option value="accesorios">accesorios</option>
        <option value="covers">covers</option>
      </select>
      <input className="input" type="number" placeholder="Stock" onChange={e=>setForm({...form, stock: Number(e.target.value)})} required />

      <div className="md:col-span-2 space-y-2">
        <label className="text-sm text-zinc-400">Imagen del producto</label>
        <input className="input" type="file" accept="image/*" onChange={async (e)=>{
          const file = e.target.files?.[0]; if (!file) return;
          const formData = new FormData(); formData.append('file', file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if (!res.ok) { toast.error('No se pudo subir la imagen'); return; }
          const data = await res.json(); setForm((prev:any)=>({ ...prev, images: [data.url] })); toast.success('Imagen subida');
        }}/>
        {form.images?.[0] && <p className="text-xs text-zinc-400">Imagen lista: {form.images[0]}</p>}
      </div>

      <textarea className="input md:col-span-2" placeholder="Descripción" onChange={e=>setForm({...form, description: e.target.value})} required />
      <button className="btn btn-primary md:col-span-2" type="submit">Crear producto</button>
    </form>

    <div className="grid md:grid-cols-2 gap-4">
      {products.map(p => (<div key={p.id} className="card flex items-center justify-between">
        <div><p className="font-medium">{p.name}</p><p className="text-sm text-zinc-400">${p.price.toFixed(2)} • {p.category}</p></div>
        <button onClick={()=>onDelete(p.id)} className="btn">Eliminar</button>
      </div>))}
    </div>
  </section>);
}
