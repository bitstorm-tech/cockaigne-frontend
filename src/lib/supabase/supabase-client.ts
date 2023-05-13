import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./generated-types";

export type Supabase = SupabaseClient<Database>;

export type Session = {
  user: {
    id: string;
    user_metadata: {
      isDealer: boolean;
      username: string;
    };
    role: string;
  };
};
