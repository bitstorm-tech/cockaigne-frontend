import type { ObjectId } from "mongodb";

export type Duration = "24h" | "48h";
export type Category = "food" | "fashion" | "technic";

export interface Deal {
  _id?: ObjectId;
  owner?: ObjectId;
  title: string;
  description: string;
  duration: Duration;
  startDate: Date;
  category: Category;
  likes: ObjectId[] | number; // id of users that liked or number of likes
}
