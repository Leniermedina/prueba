import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadImage } from '@/lib/blob';
export const runtime = 'nodejs';
export async function POST(req: NextRequest){
  const session = await getSession(); if (session?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData(); const file = form.get('file');
  if (!(file instanceof Blob)) return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  const name = `products/${Date.now()}`; const uploaded = await uploadImage(file as any, name);
  return NextResponse.json({ url: uploaded.url });
}
