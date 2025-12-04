// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { supabaseBrowser } from '../../../../../lib/supabaseClient';
import cookie from 'cookie';

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;
  const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });

  if (error || !data?.session) {
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 400 });
  }

  const token = data.session.access_token;
  const refresh_token = data.session.refresh_token;

  const headers = new Headers();
  headers.append('Set-Cookie', cookie.serialize(process.env.COOKIE_NAME || 'supabase_access_token', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800', 10)
  }));
  headers.append('Set-Cookie', cookie.serialize('supabase_refresh_token', refresh_token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800', 10)
  }));

  return new NextResponse(JSON.stringify({ user: data.user }), { status: 200, headers });
}
