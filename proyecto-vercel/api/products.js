import { createClient } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

// CORS helper
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = req.headers.authorization || '';
  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  try {
    const key = 'products:list';
    const products = (await kv.get(key)) || [];

    switch (req.method) {
      case 'GET': {
        return res.status(200).json(products);
      }
      case 'POST': {
        const newProduct = req.body || {};
        const id = uuidv4();
        const item = { id, timestamp: Date.now(), ...newProduct };
        const updated = [...products, item];
        await kv.set(key, updated);
        return res.status(201).json(item);
      }
      case 'PUT': {
        const { id, ...update } = req.body || {};
        if (!id) return res.status(400).json({ error: 'Missing id' });
        const idx = products.findIndex(p => p.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Product not found' });
        const updatedItem = { ...products[idx], ...update };
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