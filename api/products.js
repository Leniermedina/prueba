import { getKV } from './_auth.js';
import { v4 as uuidv4 } from 'uuid';
import { verifyJWT, setCORS } from './_auth.js';

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const kv = getKV();
  const key = 'products:list';
  const products = (await kv.get(key)) || [];

  if (req.method === 'GET') {
    return res.status(200).json(products);
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  const payload = verifyJWT(token);
  if (!payload || !payload.isAdmin) return res.status(403).json({ error: 'Forbidden' });

  try {
    switch (req.method) {
      case 'POST': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const id = uuidv4();
        const item = {
          id,
          timestamp: Date.now(),
          name: body.name || body.nombre || '',
          category: body.category || body.categoria || 'moviles',
          price: Number(body.price ?? body.precio ?? 0),
          image: body.image || body.imagen || '',
          description: body.description || body.descripcion || '',
        };
        const updated = [...products, item];
        await kv.set(key, updated);
        return res.status(201).json(item);
      }
      case 'PUT': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { id } = body;
        if (!id) return res.status(400).json({ error: 'Missing id' });
        const idx = products.findIndex(p => p.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Product not found' });
        const updatedItem = {
          ...products[idx],
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.nombre !== undefined ? { name: body.nombre } : {}),
          ...(body.category !== undefined ? { category: body.category } : {}),
          ...(body.categoria !== undefined ? { category: body.categoria } : {}),
          ...(body.price !== undefined ? { price: Number(body.price) } : {}),
          ...(body.precio !== undefined ? { price: Number(body.precio) } : {}),
          ...(body.image !== undefined ? { image: body.image } : {}),
          ...(body.imagen !== undefined ? { image: body.imagen } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.descripcion !== undefined ? { description: body.descripcion } : {}),
          updatedAt: Date.now(),
        };
        const updated = [...products];
        updated[idx] = updatedItem;
        await kv.set(key, updated);
        return res.status(200).json(updatedItem);
      }
      case 'DELETE': {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'Missing id query' });
        const updated = products.filter(p => p.id !== id);
        await kv.set(key, updated);
        return res.status(204).end();
      }
      default: {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (err) {
    console.error('KV error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}