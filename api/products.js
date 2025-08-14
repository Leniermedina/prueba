// /api/products.js
import { kv as defaultKv, createClient } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const kv = (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  ? createClient({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  : defaultKv;

const KEY = 'products:list';

function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body || {};
}

function requireAdmin(req, res) {
  const adminToken = process.env.ADMIN_TOKEN || '';
  const authHeader = req.headers.authorization || '';
  const ok = adminToken && authHeader === `Bearer ${adminToken}`;
  if (!ok) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const products = (await kv.get(KEY)) || [];
      return res.status(200).json({ items: products });
    }

    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      if (!requireAdmin(req, res)) return;
    }

    if (req.method === 'POST') {
      const newProduct = readJsonBody(req);
      const id = uuidv4();
      const item = { id, createdAt: Date.now(), ...newProduct };
      const products = (await kv.get(KEY)) || [];
      const updated = [...products, item];
      await kv.set(KEY, updated);
      return res.status(201).json(item);
    }

    if (req.method === 'PUT') {
      const payload = readJsonBody(req);
      const { id, ...update } = payload || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const products = (await kv.get(KEY)) || [];
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      const updatedItem = { ...products[idx], ...update, updatedAt: Date.now() };
      const updated = [...products];
      updated[idx] = updatedItem;
      await kv.set(KEY, updated);
      return res.status(200).json(updatedItem);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: 'Missing id query' });
      const products = (await kv.get(KEY)) || [];
      const updated = products.filter(p => p.id !== id);
      await kv.set(KEY, updated);
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}
