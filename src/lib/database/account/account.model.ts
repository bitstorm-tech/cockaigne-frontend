export interface Account {
  id?: number;
  email: string;
  password?: string;
  dealer: boolean;
  username?: string;
  gender?: "m" | "f";
  age?: number;
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
  activation_code?: string;
  reset_password_code?: string;
}

export interface AccountUpdateOptions {
  use_current_location?: boolean;
  use_click_on_map?: boolean;
  search_radius?: number;
  selected_categories?: number[];
  username?: string;
  password?: string;
  phone?: string;
  tax_id?: string;
  street?: string;
  house_number?: string;
  city?: string;
  zip?: number;
  location?: string;
  default_category?: string | number;
  activation_code?: string;
  reset_password_code?: string;
}
