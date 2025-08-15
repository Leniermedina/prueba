import { getKV, verifyJWT, setCORS } from './_auth.js';

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const kv = getKV();
  const key = 'texts:map';

  try {
    if (req.method === 'GET') {
      const map = (await kv.get(key)) || {};
      const q = req.query.key;
      if (q) {
        return res.status(200).json({ key: q, content: map[q] || '' });
      }
      const entries = Object.entries(map).map(([k,v]) => ({ key:k, content:v }));
      return res.status(200).json(entries);
    }

    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No token' });
    const payload = verifyJWT(token);
    if (!payload || !payload.isAdmin) return res.status(403).json({ error: 'Forbidden' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const map = (await kv.get(key)) || {};

    if (req.method === 'POST') {
      if (!body.key) return res.status(400).json({ error: 'Missing key' });
      map[body.key] = body.content ?? '';
      await kv.set(key, map);
      return res.status(201).json({ key: body.key, content: map[body.key] });
    }
    if (req.method === 'PUT') {
      if (!body.key) return res.status(400).json({ error: 'Missing key' });
      if (!(body.key in map)) return res.status(404).json({ error: 'Key not found' });
      map[body.key] = body.content ?? '';
      await kv.set(key, map);
      return res.status(200).json({ key: body.key, content: map[body.key] });
    }
    if (req.method === 'DELETE') {
      const q = req.query.key;
      if (!q) return res.status(400).json({ error: 'Missing key' });
      if (map[q] !== undefined) {
        delete map[q];
        await kv.set(key, map);
      }
      return res.status(204).end();
    }
    res.setHeader('Allow', ['GET','POST','PUT','DELETE','OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (e) {
    console.error('texts error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}