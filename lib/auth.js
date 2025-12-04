// lib/auth.js
import { cookies } from 'next/headers';
import { createSupabaseServerWithAccessToken, createSupabaseServiceClient } from './supabaseServer';

/**
 * Read access token from cookie and return { user, profile, token }
 * Use in server components or route handlers (server side).
 */
export async function getUserFromCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || 'supabase_access_token')?.value || null;
  if (!token) return { user: null, profile: null, token: null };

  const supabase = createSupabaseServerWithAccessToken(token);
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) return { user: null, profile: null, token };

  const user = userData.user;
  // attempt to fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single().catch(()=>({ data: null }));

  return { user, profile, token };
}

/**
 * Verify that the current request is from an admin user.
 * Returns true/false.
 */
export async function isRequestAdmin() {
  const { user, profile } = await getUserFromCookie();
  return Boolean(profile?.is_admin);
}
