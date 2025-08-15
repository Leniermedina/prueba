import { getKV, verifyJWT, setCORS } from './_auth.js';

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET','OPTIONS']);
    return res.status(405).end('Method Not Allowed');
  }
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  const payload = verifyJWT(token);
  if (!payload) return res.status(401).json({ error: 'Token inválido' });
  const kv = getKV();
  const user = await kv.get(`user:${payload.sub}`);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  return res.status(200).json({ id: user.id, name: user.name, email: user.email });
}