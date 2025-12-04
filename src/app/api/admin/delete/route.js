// src/app/api/admin/delete/route.js
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../../lib/auth';
import { createSupabaseServiceClient } from '../../../../../lib/supabaseServer';

export async function POST(req) {
  const { user, profile } = await getUserFromCookie();
  if (!user || !profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const svc = createSupabaseServiceClient();
  // delete profile row
  await svc.from('profiles').delete().eq('id', id);
  // delete user from auth
  try {
    // supabase-js supports admin api via auth.admin.deleteUser (service role)
    await svc.auth.admin.deleteUser(id);
  } catch (e) {
    console.error('delete user error', e);
  }

  return NextResponse.json({ ok: true });
}
