// src/app/api/admin/role/route.js
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../../lib/auth';
import { createSupabaseServiceClient } from '../../../../../lib/supabaseServer';

export async function POST(req) {
  const { user, profile } = await getUserFromCookie();
  if (!user || !profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const svc = createSupabaseServiceClient();
  const { data: p } = await svc.from('profiles').select('is_admin').eq('id', id).single();
  const newVal = !p?.is_admin;
  await svc.from('profiles').update({ is_admin: newVal }).eq('id', id);

  return NextResponse.json({ ok: true });
}
