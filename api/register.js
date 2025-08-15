import { getKV, hashPassword, signJWT, setCORS, createInitialAdmin } from './_auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  setCORS(res);
  
  try {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST', 'OPTIONS']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    // Crear admin inicial si no existe
    await createInitialAdmin();
    
    const kv = getKV();
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Name, valid email, and password (min 8 chars) are required' });
    }
    
    const idxKey = `user:email:${email}`;
    const existingUserId = await kv.get(idxKey);
    
    if (existingUserId) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    const id = uuidv4();
    const isAdmin = email === process.env.ADMIN_EMAIL;
    
    const user = {
      id,
      name,
      email,
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
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 días
    });
    
    return res.status(201).json({
      token,
      user: {
        id,
        name,
        email,
        isAdmin
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}