import { getKV, hashPassword, signJWT, setCORS, createInitialAdmin } from './_auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST','OPTIONS']);
    return res.status(405).end('Method Not Allowed');
  }
  
  // Crear admin inicial si no existe
  await createInitialAdmin();
  
  try {
    const kv = getKV();
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const name = (body.name || body.nombre || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Datos inválidos (password >= 8).' });
    }
    
    const idxKey = `user:email:${email}`;
    const existsId = await kv.get(idxKey);
    if (existsId) return res.status(409).json({ error: 'Email ya registrado' });
    
    const id = uuidv4();
    const isAdmin = email === process.env.ADMIN_EMAIL;
    const user = {
      id, name, email,
      password: hashPassword(password),
      createdAt: Date.now(),
      isAdmin
    };
    
    await kv.set(idxKey, id);
    await kv.set(`user:${id}`, user);
    
    const token = signJWT({ 
      sub: id, 
      name, 
      email, 
      isAdmin,
      exp: Date.now() + 1000*60*60*24*30 
    });
    
    return res.status(201).json({ token, user: { id, name, email, isAdmin } });
  } catch (e) {
    console.error('register error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}