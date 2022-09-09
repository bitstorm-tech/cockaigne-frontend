export interface Account {
  id?: number;
  email: string;
  password?: string;
  dealer: boolean;
  company_name?: string;
  street?: string;
  house_number?: string;
  city?: string;
  zip?: number;
  phone?: string;
  search_radius?: number;
  use_current_location?: boolean;
  use_click_on_map?: boolean;
  likes_deal_id?: number[];
  favorites_deal_id?: number[];
}

export interface AccountUpdateOptions {
  use_current_location?: boolean;
  use_click_on_map?: boolean;
  search_radius?: number;
}
