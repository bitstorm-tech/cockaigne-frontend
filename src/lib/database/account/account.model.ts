export interface Account {
  id?: number;
  email: string;
  password?: string;
  dealer: boolean;
  username?: string;
  gender?: "m" | "f";
  age?: number;
  company_name?: string;
  street?: string;
  house_number?: string;
  city?: string;
  zip?: number;
  phone?: string;
  tax_id?: string;
  location?: string;
  profile_image?: string;
  default_category: number;
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
  company_name?: string;
  phone?: string;
  tax_id?: string;
  street?: string;
  house_number?: string;
  city?: string;
  zip?: number;
  location?: string;
}
