import { cookies } from "next/headers";
import { 
  createSupabaseServerWithAccessToken 
} from "./supabaseServer";

export async function getUserFromCookie() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(
      process.env.COOKIE_NAME || "supabase_access_token"
    )?.value;

    if (!token) return { user: null, profile: null, token: null };

    const supabase = createSupabaseServerWithAccessToken(token);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return { user: null, profile: null, token };
    }

    const user = userData.user;

    // Fetch profile with safe fallback
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return { user, profile, token };
  } catch (error) {
    console.error("Error reading cookie:", error);
    return { user: null, profile: null, token: null };
  }
}

export async function isRequestAdmin() {
  const { profile } = await getUserFromCookie();
  return Boolean(profile?.is_admin);
}
