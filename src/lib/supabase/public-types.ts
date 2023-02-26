import type { Database } from "./generated-types";

export type Deal = Database["public"]["Tables"]["deals"]["Row"] & { imageUrls?: string[] };
export type ActiveDeal = Database["public"]["Views"]["active_deals"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"] & { profileImageUrl?: string };
export type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"];
export type ReportedDeal = Database["public"]["Tables"]["reported_deals"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type SelectedCategory = Database["public"]["Tables"]["selected_categories"]["Row"];
