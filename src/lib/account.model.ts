import type { ObjectId } from "mongodb";

export interface Account {
  email: string;
  password: string;
  isDealer: boolean;
  likes: ObjectId[];
  favoriteDeals: ObjectId[];
}
