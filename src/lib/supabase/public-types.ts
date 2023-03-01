import type { Database } from "./generated-types";

export type Account = Database["public"]["Tables"]["accounts"]["Row"] & { profileImageUrl?: string };
export type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"];
export type ActiveDeal = Database["public"]["Views"]["active_deals"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Deal = Database["public"]["Tables"]["deals"]["Row"] & { imageUrls?: string[] };
export type Dealer = Database["public"]["Views"]["dealer"]["Row"];
export type Rating = Database["public"]["Views"]["dealer_ratings_view"]["Row"];
export type ReportedDeal = Database["public"]["Tables"]["reported_deals"]["Row"];
export type SelectedCategory = Database["public"]["Tables"]["selected_categories"]["Row"];
