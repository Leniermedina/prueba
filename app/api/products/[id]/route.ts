import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { requireAdmin } from '@lib/auth';
import { productSchema } from '@lib/validators';
export const runtime = 'nodejs';
const idSchema = z.string().uuid();
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();
  const id = idSchema.parse(params.id);
  const body = await req.json();
  const prev = await kv.hgetall<any>(`product:${id}`);
  if (!prev) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const product = productSchema.parse({ ...prev, ...body, id, updatedAt: Date.now() });
  await kv.hset(`product:${id}`, product);
  return NextResponse.json(product);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();
  const id = idSchema.parse(params.id);
  const prev = await kv.hgetall<any>(`product:${id}`);
  if (prev) { await kv.del(`product:${id}`); await kv.srem('products:index', id); await kv.srem(`products:cat:${prev.category}`, id); }
  return NextResponse.json({ ok: true });
}