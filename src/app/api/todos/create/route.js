// src/app/api/todos/create/route.js
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '../../../../../lib/auth';
import { createSupabaseServerWithAccessToken } from '../../../../../lib/supabaseServer';

export async function POST(req) {
  const { user, token } = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const body = await req.json();
  const { title, description, due_date } = body;
  const supabase = createSupabaseServerWithAccessToken(token);

  const { error } = await supabase.from('todos').insert({
    user_id: user.id,
    title,
    description,
    due_date: due_date || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 200 });
}
