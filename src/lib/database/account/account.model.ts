export interface Account {
  id: number;
  email: string;
  password: string;
  dealer: boolean;
  likes_deal_id?: number[];
  favorites_deal_id?: number[];
}
