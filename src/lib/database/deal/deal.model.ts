import { getNowAsIsoString } from "../../date.service";
import type { Position } from "../../geo/geo.types";

export interface Deal {
  id: number;
  dealer_id: number;
  company_name?: string;
  title: string;
  description: string;
  category_id: number;
  duration: string;
  start: string;
  template: boolean;
  likes?: number;
  location?: Position | string;
}

export function newDeal(): Deal {
  return {
    id: -1,
    dealer_id: -1,
    start: getNowAsIsoString(),
    title: "",
    description: "",
    duration: "24",
    template: false,
    category_id: 1
  };
}

export interface DealFilter {
  location: Position;
  radius: number;
  categoryIds: number[];
}
