import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getSession } from '@lib/auth';
import { z } from 'zod';
export const runtime = 'nodejs';
export async function DELETE(_req: NextRequest, { params }: { params: { productId: string } }) {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const productId = z.string().uuid().parse(params.productId);
  const key = `cart:user:${user.id}`;
  const cart = (await kv.get<any>(key)) || { items: [], subtotal: 0 };
  const items = (cart.items || []).filter((i: any) => i.productId !== productId);
  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
  await kv.set(key, { items, subtotal });
  return NextResponse.json({ items, subtotal });
}