import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getSession } from '@lib/auth';
import { z } from 'zod';
export const runtime = 'nodejs';
type Cart = { items: { productId: string; name: string; price: number; qty: number }[]; subtotal: number };
const postSchema = z.object({ productId: z.string().uuid(), name: z.string().min(1), price: z.number().min(0), qty: z.number().int().min(0).max(999) });
export async function GET() {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ items: [], subtotal: 0 });
  const key = `cart:user:${user.id}`;
  const cart = (await kv.get<Cart>(key)) || { items: [], subtotal: 0 };
  return NextResponse.json(cart);
}
export async function POST(req: NextRequest) {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  const key = `cart:user:${user.id}`;
  const cart = (await kv.get<Cart>(key)) || { items: [], subtotal: 0 };
  const idx = cart.items.findIndex((i) => i.productId === parsed.data.productId);
  if (idx >= 0) { if (parsed.data.qty === 0) cart.items.splice(idx, 1); else cart.items[idx] = parsed.data; }
  else if (parsed.data.qty > 0) cart.items.push(parsed.data);
  cart.subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  await kv.set(key, cart);
  return NextResponse.json(cart);
}