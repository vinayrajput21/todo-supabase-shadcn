// src/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { supabaseBrowser } from '../../../../lib/supabaseClient';
import { createSupabaseServiceClient } from '../../../../lib/supabaseServer';
import cookie from 'cookie';

export async function POST(req) {
  const body = await req.json();
  const { email, password, full_name } = body;
  const { data, error } = await supabaseBrowser.auth.signUp({ email, password });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // if instant session created, set cookies
  const headers = new Headers();
  if (data?.session) {
    headers.append('Set-Cookie', cookie.serialize(process.env.COOKIE_NAME || 'supabase_access_token', data.session.access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800', 10)
    }));
    headers.append('Set-Cookie', cookie.serialize('supabase_refresh_token', data.session.refresh_token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800', 10)
    }));
  }

  // create profile using service_role
  try {
    const svc = createSupabaseServiceClient();
    await svc.from('profiles').insert({ id: data.user.id, full_name }).select();
  } catch (e) {
    console.error('profile create failed', e);
  }

  return new NextResponse(JSON.stringify({ user: data.user }), { status: 200, headers });
}
