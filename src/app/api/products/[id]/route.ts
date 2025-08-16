import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { productSchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
export const runtime = 'nodejs';
export async function GET(_: NextRequest, { params }: { params: { id: string } }){
  const product = await kv.hgetall<any>(`product:${params.id}`);
  if (!product) return NextResponse.json({ error:'Not found' }, { status: 404 });
  return NextResponse.json(product);
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
  const session = await getSession(); if (session?.role !== 'admin') return NextResponse.json({ error:'Unauthorized' }, { status: 401 });
  const data = await req.json(); const parsed = productSchema.partial().safeParse(data); if (!parsed.success) return NextResponse.json({ error:'Invalid' }, { status: 400 });
  const key = `product:${params.id}`; const exists = await kv.exists(key); if (!exists) return NextResponse.json({ error:'Not found' }, { status: 404 });
  const prev = await kv.hgetall<any>(key); const next = { ...prev, ...parsed.data, updatedAt: Date.now() }; await kv.hset(key, next);
  if (parsed.data?.category && parsed.data.category !== prev.category){ await kv.srem(`products:cat:${prev.category}`, params.id); await kv.sadd(`products:cat:${parsed.data.category}`, params.id); }
  if (parsed.data?.slug && parsed.data.slug !== prev.slug){ await kv.del(`product:slug:${prev.slug}`); await kv.set(`product:slug:${parsed.data.slug}`, params.id); }
  return NextResponse.json(next);
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }){
  const session = await getSession(); if (session?.role !== 'admin') return NextResponse.json({ error:'Unauthorized' }, { status: 401 });
  const key = `product:${params.id}`; const product = await kv.hgetall<any>(key); if (!product) return NextResponse.json({ error:'Not found' }, { status: 404 });
  await kv.del(key); await kv.del(`product:slug:${product.slug}`); await kv.srem('products:index', params.id); await kv.srem(`products:cat:${product.category}`, params.id);
  return NextResponse.json({ ok:true });
}
