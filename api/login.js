import { getKV, verifyPassword, signJWT, setCORS } from './_auth.js';

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST','OPTIONS']);
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const kv = getKV();
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const idxKey = `user:email:${email}`;
    const id = await kv.get(idxKey);
    if (!id) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = await kv.get(`user:${id}`);
    if (!user || !verifyPassword(password, user.password)) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = signJWT({ 
      sub: user.id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.email === process.env.ADMIN_EMAIL,
      exp: Date.now() + 1000*60*60*24*30 
    });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.email === process.env.ADMIN_EMAIL } });
  } catch (e) {
    console.error('login error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}