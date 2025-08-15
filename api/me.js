import { getKV, verifyJWT, setCORS } from './_auth.js';

export default async function handler(req, res) {
  setCORS(res);
  
  try {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET', 'OPTIONS']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    const payload = verifyJWT(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    const kv = getKV();
    const user = await kv.get(`user:${payload.sub}`);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
    
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}