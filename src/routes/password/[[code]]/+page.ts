import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params }: LoadEvent) {
  return {
    passwordResetCode: params.code
  };
}
