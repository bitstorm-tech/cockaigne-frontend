import { logError, translateError } from "$lib/error-utils";
import type { Supabase } from "$lib/supabase/supabase-client";

export async function verifyRegistration(
  supabase: Supabase,
  email: string,
  token: string
): Promise<string | undefined> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup"
  });

  if (error) {
    return logError(error, "Can't verify registration", translateError(error));
  }
}

export async function logout(supabase: Supabase) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    logError(error, "Can't logout");
  }
}

export async function login(supabase: Supabase, email: string, password: string): Promise<string | undefined> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return logError(error, "Can't login", translateError(error));
  }
}
