import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { productSchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
export const runtime = 'nodejs';
export async function GET(req: NextRequest){
  const url = new URL(req.url); const category = url.searchParams.get('category') as 'moviles'|'accesorios'|'covers'|null;
  const ids = category ? await kv.smembers<string>(`products:cat:${category}`) : await kv.smembers<string>('products:index');
  const list:any[]=[]; for (const id of ids){ const p = await kv.hgetall<any>(`product:${id}`); if (p) list.push(p); } return NextResponse.json(list);
}
export async function POST(req: NextRequest){
  const session = await getSession(); if (session?.role !== 'admin') return NextResponse.json({ error:'Unauthorized' }, { status: 401 });
  const data = await req.json(); const parsed = productSchema.safeParse(data); if (!parsed.success) return NextResponse.json({ error:'Invalid' }, { status: 400 });
  const id = crypto.randomUUID(); const now = Date.now(); const product = { id, ...parsed.data, createdAt: now, updatedAt: now };
  await kv.hset(`product:${id}`, product); await kv.set(`product:slug:${product.slug}`, id); await kv.sadd('products:index', id); await kv.sadd(`products:cat:${product.category}`, id);
  return NextResponse.json(product, { status: 201 });
}
