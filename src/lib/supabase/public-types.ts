import type { Database } from "./supabase-types";

export type Deal = Database["public"]["Tables"]["deals"]["Row"];
