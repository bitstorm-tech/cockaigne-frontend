import type { LoadEvent } from "@sveltejs/kit";

export async function load({ params }: LoadEvent) {
  const email = params.email || "";

  return {
    email
  };
}
