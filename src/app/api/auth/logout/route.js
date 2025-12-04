// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function GET() {
  const headers = new Headers();
  headers.append('Set-Cookie', cookie.serialize(process.env.COOKIE_NAME || 'supabase_access_token', '', {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: -1
  }));
  headers.append('Set-Cookie', cookie.serialize('supabase_refresh_token', '', {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: -1
  }));

  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers });
}
