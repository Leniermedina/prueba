import { getKV, verifyPassword, signJWT, setCORS, createInitialAdmin } from './_auth.js';

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
    
    const email = (body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const idxKey = `user:email:${email}`;
    const userId = await kv.get(idxKey);
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = signJWT({
      sub: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 días
    });
    
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}