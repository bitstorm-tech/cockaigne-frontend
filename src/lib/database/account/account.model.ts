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
  searchRadius?: number;
  useCurrentLocation?: boolean;
  likes_deal_id?: number[];
  favorites_deal_id?: number[];
}

export interface AccountUpdateOptions {
  use_current_location?: boolean;
  use_click_on_map?: boolean;
  search_radius?: number;
}
