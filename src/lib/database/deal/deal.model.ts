import { getDateTimeAsIsoString } from "$lib/date-time.utils";
import type { Position } from "$lib/geo/geo.types";

export interface Deal {
  id?: string;
  dealer_id: string;
  username?: string;
  title: string;
  description: string;
  category_id: number;
  duration: string | number;
  start: string;
  template: boolean;
  likes?: number;
  location?: Position | string;
  imageUrls?: string[];
}

export function newDeal(): Deal {
  return {
    dealer_id: "",
    start: getDateTimeAsIsoString(new Date(), 60),
    title: "",
    description: "",
    duration: "24",
    template: false,
    category_id: 1
  };
}

export interface DealFilter {
  location?: Position;
  radius?: number;
  extent?: number[];
  categoryIds?: number[];
  limit?: number;
  order?: {
    column: string;
    ascending?: boolean;
  };
}
