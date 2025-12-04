import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createSupabaseServiceClient() {
  return createClient(url, serviceRole);
}

export function createSupabaseServerWithAccessToken(accessToken) {
  if (!accessToken) {
    return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
