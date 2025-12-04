// src/app/api/todos/delete/route.js
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../../lib/auth';
import { createSupabaseServerWithAccessToken } from '../../../../../lib/supabaseServer';

export async function POST(req) {
  const { user, token } = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = createSupabaseServerWithAccessToken(token);
  const { data: todo } = await supabase.from('todos').select('*').eq('id', id).single();

  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (todo.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true }, { status: 200 });
}
