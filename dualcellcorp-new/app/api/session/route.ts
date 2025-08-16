import { NextResponse } from 'next/server';
import { getSession } from '@lib/auth';
export const runtime = 'nodejs';
export async function GET() { const { user, isAdmin } = await getSession(); return NextResponse.json({ user, isAdmin }); }