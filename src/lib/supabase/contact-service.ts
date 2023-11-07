import { logError } from "$lib/error-utils";
import type { Supabase } from "$lib/supabase/supabase-client";

export async function saveContactMessage(supagase: Supabase, accountId: string, message: string): Promise<boolean> {
  const { error } = await supagase.from("contact_messages").insert({ message, account_id: accountId });

  if (error) {
    return logError(error, "Can't save contact message", false);
  }

  return true;
}
