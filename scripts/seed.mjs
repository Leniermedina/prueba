import { kv } from '@vercel/kv';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) { console.error('Faltan ADMIN_EMAIL/ADMIN_PASSWORD en .env'); process.exit(1); }
async function seed(){
  const demo = [
    { slug:'galaxy-a05', name:'Samsung Galaxy A05', price:199.99, category:'moviles', images:['/og-image.png'], description:'Smartphone confiable', stock:12, featured:true },
    { slug:'cargador-usb-c', name:'Cargador USB-C 20W', price:14.99, category:'accesorios', images:['/og-image.png'], description:'Carga rápida', stock:50 },
    { slug:'cover-slim', name:'Cover Slim', price:9.99, category:'covers', images:['/og-image.png'], description:'Protección ligera', stock:30 }
  ];
  for (const p of demo){
    const id = crypto.randomUUID(); const now = Date.now();
    const prod = { id, ...p, createdAt: now, updatedAt: now };
    await kv.hset(`product:${id}`, prod);
    await kv.set(`product:slug:${p.slug}`, id);
    await kv.sadd('products:index', id);
    await kv.sadd(`products:cat:${p.category}`, id);
  }
  console.log('Seed de productos listo');
}
seed().then(()=>process.exit(0));
