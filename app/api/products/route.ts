import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { put } from '@vercel/blob';
import { requireAdmin } from '@lib/auth';
import { productSchema } from '@lib/validators';
export const runtime = 'nodejs';
const qSchema = z.object({ category: z.enum(['moviles','covers','accesorios']).optional(), cursor: z.string().optional(), take: z.coerce.number().min(1).max(100).optional() });
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = qSchema.parse({ category: url.searchParams.get('category') || undefined, cursor: url.searchParams.get('cursor') || undefined, take: url.searchParams.get('take') || '12' });
  const ids = q.category ? await kv.smembers<string>(`products:cat:${q.category}`) : await kv.smembers<string>('products:index');
  const start = q.cursor ? Math.max(0, ids.indexOf(q.cursor) + 1) : 0;
  const slice = ids.slice(start, start + (q.take || 12));
  const items = (await Promise.all(slice.map((id) => kv.hgetall<any>(`product:${id}`)))).filter(Boolean);
  const nextCursor = (start + (q.take || 12) < ids.length) ? slice[slice.length - 1] : null;
  return NextResponse.json({ items, nextCursor });
}
export async function POST(req: NextRequest) {
  await requireAdmin();
  const formData = await req.formData();
  const name = String(formData.get('name') || '');
  const price = Number(formData.get('price') || 0);
  const category = String(formData.get('category') || '') as any;
  const file = formData.get('image') as File | null;
  let imageUrl: string | undefined;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
    const filename = `products/${crypto.randomUUID()}.${ext}`;
    const uploaded = await put(filename, buffer, { access: 'public', addRandomSuffix: false, token: process.env.BLOB_READ_WRITE_TOKEN });
    imageUrl = uploaded.url;
  }
  const id = crypto.randomUUID();
  const product = productSchema.parse({ id, name, price, category, imageUrl, createdAt: Date.now(), updatedAt: Date.now() });
  await kv.hset(`product:${id}`, product); await kv.sadd('products:index', id); await kv.sadd(`products:cat:${category}`, id);
  return NextResponse.json(product, { status: 201 });
}