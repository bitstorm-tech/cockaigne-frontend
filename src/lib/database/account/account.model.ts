export interface Account {
  id?: number;
  email: string;
  password: string;
  dealer: boolean;
  companyName?: string;
  street?: string;
  houseNumber?: string;
  city?: string;
  zip?: number;
  phone?: string;
  likes_deal_id?: number[];
  favorites_deal_id?: number[];
}
