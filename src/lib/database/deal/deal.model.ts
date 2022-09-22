import { getNowAsIsoString } from "../../date.service";
import type { Position } from "../../geo/geo.types";

export interface Deal {
  id: number;
  account_id: number;
  title: string;
  description: string;
  category: number;
  duration: string;
  start: string;
  template: boolean;
  likes?: number;
  location?: Position | string;
}

export function newDeal(): Deal {
  return {
    id: -1,
    account_id: -1,
    start: getNowAsIsoString(),
    title: "",
    description: "",
    duration: "24",
    template: false,
    category: 1
  };
}

export interface DealFilter {
  location: Position;
  radius: number;
  categories: number[];
}
