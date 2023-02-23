import type { Database } from "./generated-types";

export type Deal = Database["public"]["Tables"]["deals"]["Row"] & { imageUrls?: string[] };
export type ActiveDeal = Database["public"]["Views"]["active_deals"]["Row"];
