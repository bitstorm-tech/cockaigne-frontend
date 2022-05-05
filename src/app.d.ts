/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
import type { JWTPayload } from "jose";

declare global {
  declare namespace App {
    interface Locals {
      jwt: JWTPayload;
    }
    // interface Platform {}
    // interface Session {}
    // interface Stuff {}
  }
}
