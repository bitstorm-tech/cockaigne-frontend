/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces

import type { Session, Supabase } from "$lib/supabase/supabase-client";

declare global {
  declare namespace App {
    interface Locals {
      supabase: Supabase;
      getSession: () => Promise;
    }

    interface PageData {
      supabase: Supabase;
      session: Session;
    }
  }
}
