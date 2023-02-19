import { getDateTimeAsIsoString } from "$lib/date-time.utils";
import type { Position } from "$lib/geo/geo.types";
import type { Extent } from "ol/extent";

export interface Deal {
  id?: string;
  dealer_id: string;
  username?: string;
  title: string;
  description: string;
  category_id: number;
  duration: string | number;
  start: string | number;
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
  extent?: Extent;
  categoryIds?: number[];
  limit?: number;
  orderBy?: string;
}
