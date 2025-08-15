import crypto from 'crypto';
import { createClient } from '@vercel/kv';

export function getKV() {
  if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('KV environment variables not set!');
  }
  
  return createClient({
    url: process.env.KV_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

function b64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function signJWT(payload) {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET is not defined!');
  }
  
  const header = { alg: 'HS256', typ: 'JWT' };
  const secret = process.env.AUTH_SECRET;
  
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${p}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  return `${h}.${p}.${signature}`;
}

export function verifyJWT(token) {
  if (!token || typeof token !== 'string') return null;
  
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    if (!headerB64 || !payloadB64 || !signature) return null;

    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;

    const checkSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== checkSignature) return null;

    const payload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );

    if (payload.exp && Date.now() >= payload.exp) return null;
    
    return payload;
  } catch (e) {
    console.error('JWT verification error:', e);
    return null;
  }
}

// ... (resto de funciones sin cambios) ...

// Crear admin inicial si no existe
export async function createInitialAdmin() {
  try {
    const kv = getKV();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set');
      return;
    }
    
    const idxKey = `user:email:${adminEmail}`;
    const existsId = await kv.get(idxKey);
    
    if (!existsId) {
      const id = crypto.randomUUID();
      const user = {
        id,
        name: "Admin",
        email: adminEmail,
        password: hashPassword(adminPassword),
        createdAt: Date.now(),
        isAdmin: true
      };
      await kv.set(idxKey, id);
      await kv.set(`user:${id}`, user);
      console.log("Admin inicial creado exitosamente");
    }
  } catch (e) {
    console.error('Error creating initial admin:', e);
  }
}