import type { ObjectId } from "mongodb";

export type Duration = "24h" | "48h";
export type Category = "food" | "fashion" | "technic";

export interface Deal {
  _id?: string | ObjectId;
  owner?: string | ObjectId;
  title: string;
  description: string;
  duration: Duration;
  startDate: string;
  category: Category;
  likes?: string[] | ObjectId[] | number; // id of users that liked or number of likes
}
