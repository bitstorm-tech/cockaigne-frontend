import { browser } from "$app/environment";
import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { AuthError, createClient } from "@supabase/supabase-js";
import type { Database } from "./generated-types";

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL || "", PUBLIC_SUPABASE_API_KEY || "");

export function translateError(error: AuthError): string {
  switch (error.status) {
    case 400:
      return "E-Mail und/oder Passwort falsch oder dein Account ist noch nicht aktiviert";
    case 401:
      return "Der Aktivierungscode ist falsch";
    case 404:
      return "Es scheint so, als wärst du noch nicht registriert";
    case 422:
      return error.message.toLowerCase().includes("password")
        ? "Das Passwort muss mindestens aus 6 Zeichen bestehen"
        : "Format der E-Mail ist ungültig";
    default:
      return `${error.message} (${error.status})`;
  }
}

export async function getUserId(): Promise<string | undefined> {
  const { error, data } = await supabase.auth.getSession();

  if (error) {
    console.log("Can't get user id:", error);
    return;
  }

  return data.session?.user.id;
}

supabase.auth.onAuthStateChange((event, session) => {
  if (!browser) {
    return;
  }

  if (event === "SIGNED_OUT" || event === "USER_DELETED") {
    // delete cookies on sign out
    const expires = new Date(0).toUTCString();
    document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
  } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    const maxAge = 5 * 24 * 60 * 60; // 5 days
    document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
  }
});
