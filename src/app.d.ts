/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces

import { Session, SupabaseClient } from "@supabase/supabase-js";

declare global {
  declare namespace App {
    interface Locals {
      supabase: SupabaseClient;

      getSession(): Promise<Session | null>;

      isDealer(): Promise<true>;
    }
  }
}
