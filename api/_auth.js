import crypto from 'crypto';
import { createClient } from '@vercel/kv';

export function getKV() {
  return createClient({
    url: process.env.KV_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}

export function signJWT(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const secret = process.env.AUTH_SECRET;
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  return `${h}.${p}.${sig}`;
}

export function verifyJWT(token) {
  try{
    const [h,p,sig] = token.split('.');
    const secret = process.env.AUTH_SECRET;
    const check = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    if (check !== sig) return null;
    const payload = JSON.parse(Buffer.from(p.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8'));
    if (payload.exp && Date.now() >= payload.exp) return null;
    return payload;
  }catch(e){ return null; }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString('base64')}:${hash.toString('base64')}`;
}

export function verifyPassword(password, stored) {
  try {
    const [algo, saltB64, hashB64] = stored.split(':');
    if (algo !== 'scrypt') return false;
    const salt = Buffer.from(saltB64, 'base64');
    const hash = Buffer.from(hashB64, 'base64');
    const test = crypto.scryptSync(password, salt, hash.length);
    return crypto.timingSafeEqual(hash, test);
  } catch { return false; }
}

export function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}