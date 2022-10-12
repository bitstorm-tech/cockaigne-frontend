export interface Account {
  id?: number;
  email: string;
  password?: string;
  dealer: boolean;
  username?: string;
  company_name?: string;
  street?: string;
  house_number?: string;
  city?: string;
  zip?: number;
  phone?: string;
  profile_image?: string;
  search_radius?: number;
  use_current_location?: boolean;
  selected_categories?: number[];
  likes_deal_id?: number[];
  favorites_deal_id?: number[];
}

export interface AccountUpdateOptions {
  use_current_location?: boolean;
  use_click_on_map?: boolean;
  search_radius?: number;
  selected_categories?: number[];
  username?: string;
}
