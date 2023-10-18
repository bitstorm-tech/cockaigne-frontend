export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          age: number | null
          city: string | null
          created: string
          default_category: number | null
          email: string
          gender: string | null
          house_number: string | null
          id: string
          is_dealer: boolean
          location: unknown | null
          phone: string | null
          search_radius: number
          street: string | null
          tax_id: string | null
          use_current_location: boolean
          username: string
          zip: number | null
        }
        Insert: {
          age?: number | null
          city?: string | null
          created?: string
          default_category?: number | null
          email: string
          gender?: string | null
          house_number?: string | null
          id?: string
          is_dealer?: boolean
          location?: unknown | null
          phone?: string | null
          search_radius?: number
          street?: string | null
          tax_id?: string | null
          use_current_location?: boolean
          username: string
          zip?: number | null
        }
        Update: {
          age?: number | null
          city?: string | null
          created?: string
          default_category?: number | null
          email?: string
          gender?: string | null
          house_number?: string | null
          id?: string
          is_dealer?: boolean
          location?: unknown | null
          phone?: string | null
          search_radius?: number
          street?: string | null
          tax_id?: string | null
          use_current_location?: boolean
          username?: string
          zip?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_default_category_fkey"
            columns: ["default_category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      activated_vouchers: {
        Row: {
          activated: string
          user_id: string
          voucher_code: string
        }
        Insert: {
          activated?: string
          user_id: string
          voucher_code: string
        }
        Update: {
          activated?: string
          user_id?: string
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "activated_vouchers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activated_vouchers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activated_vouchers_voucher_code_fkey"
            columns: ["voucher_code"]
            referencedRelation: "vouchers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "activated_vouchers_voucher_code_fkey"
            columns: ["voucher_code"]
            referencedRelation: "active_vouchers_view"
            referencedColumns: ["code"]
          }
        ]
      }
      admin_accounts: {
        Row: {
          comment: string
          created_at: string | null
          deleted_at: string | null
          id: number
          is_active: boolean
          password: string
          updated_at: string | null
          username: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          is_active: boolean
          password: string
          updated_at?: string | null
          username: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          is_active?: boolean
          password?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      dealer_ratings: {
        Row: {
          created: string
          dealer_id: string
          rating_text: string | null
          stars: number
          user_id: string
        }
        Insert: {
          created?: string
          dealer_id: string
          rating_text?: string | null
          stars: number
          user_id: string
        }
        Update: {
          created?: string
          dealer_id?: string
          rating_text?: string | null
          stars?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_ratings_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_ratings_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      deals: {
        Row: {
          category_id: number
          created: string
          dealer_id: string
          description: string
          duration: number
          id: string
          start: string
          template: boolean
          title: string
        }
        Insert: {
          category_id: number
          created?: string
          dealer_id: string
          description: string
          duration: number
          id?: string
          start: string
          template?: boolean
          title: string
        }
        Update: {
          category_id?: number
          created?: string
          dealer_id?: string
          description?: string
          duration?: number
          id?: string
          start?: string
          template?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      favorite_dealers: {
        Row: {
          created: string
          dealer_id: string
          user_id: string
        }
        Insert: {
          created?: string
          dealer_id: string
          user_id: string
        }
        Update: {
          created?: string
          dealer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_dealers_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_dealers_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_dealers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_dealers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      hot_deals: {
        Row: {
          created: string
          deal_id: string
          user_id: string
        }
        Insert: {
          created?: string
          deal_id: string
          user_id: string
        }
        Update: {
          created?: string
          deal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hot_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hot_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "active_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hot_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "future_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hot_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "past_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hot_deals_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hot_deals_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          created: string
          deal_id: string
          user_id: string
        }
        Insert: {
          created?: string
          deal_id: string
          user_id: string
        }
        Update: {
          created?: string
          deal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "active_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "future_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "past_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      plans: {
        Row: {
          active: boolean
          created: string
          free_days_per_month: number
          id: number
          stripe_product_id: string
        }
        Insert: {
          active?: boolean
          created?: string
          free_days_per_month: number
          id?: number
          stripe_product_id: string
        }
        Update: {
          active?: boolean
          created?: string
          free_days_per_month?: number
          id?: number
          stripe_product_id?: string
        }
        Relationships: []
      }
      reported_deals: {
        Row: {
          created: string
          deal_id: string
          reason: string
          reporter_id: string
        }
        Insert: {
          created?: string
          deal_id: string
          reason: string
          reporter_id: string
        }
        Update: {
          created?: string
          deal_id?: string
          reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reported_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reported_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "active_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reported_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "future_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reported_deals_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "past_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reported_deals_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reported_deals_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      selected_categories: {
        Row: {
          category_id: number
          created: string
          user_id: string
        }
        Insert: {
          category_id: number
          created?: string
          user_id: string
        }
        Update: {
          category_id?: number
          created?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "selected_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selected_categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selected_categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          active: boolean
          created: string
          plan_id: number
          stripe_subscription_id: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created?: string
          plan_id: number
          stripe_subscription_id: string
          user_id: string
        }
        Update: {
          active?: boolean
          created?: string
          plan_id?: number
          stripe_subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      vouchers: {
        Row: {
          code: string
          comment: string
          created_at: string | null
          deleted_at: string | null
          duration_in_days: number | null
          end: string | null
          id: number
          is_active: boolean
          multi_use: boolean
          start: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          comment: string
          created_at?: string | null
          deleted_at?: string | null
          duration_in_days?: number | null
          end?: string | null
          id?: number
          is_active: boolean
          multi_use: boolean
          start?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          comment?: string
          created_at?: string | null
          deleted_at?: string | null
          duration_in_days?: number | null
          end?: string | null
          id?: number
          is_active?: boolean
          multi_use?: boolean
          start?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_deals_view: {
        Row: {
          category_id: number | null
          dealer_id: string | null
          description: string | null
          duration: number | null
          id: string | null
          likes: number | null
          location: unknown | null
          start: string | null
          start_time: string | null
          title: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      active_vouchers_view: {
        Row: {
          activated: string | null
          code: string | null
          duration_in_days: number | null
          end: string | null
          start: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activated_vouchers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activated_vouchers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      dealer_ratings_view: {
        Row: {
          created: string | null
          dealer_id: string | null
          rating_text: string | null
          stars: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_ratings_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_ratings_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      dealer_view: {
        Row: {
          category: string | null
          city: string | null
          house_number: string | null
          id: string | null
          phone: string | null
          street: string | null
          username: string | null
          zip: number | null
        }
        Insert: {
          category?: never
          city?: string | null
          house_number?: string | null
          id?: string | null
          phone?: string | null
          street?: string | null
          username?: string | null
          zip?: number | null
        }
        Update: {
          category?: never
          city?: string | null
          house_number?: string | null
          id?: string | null
          phone?: string | null
          street?: string | null
          username?: string | null
          zip?: number | null
        }
        Relationships: []
      }
      favorite_dealers_view: {
        Row: {
          dealer_id: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorite_dealers_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_dealers_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_dealers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_dealers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      future_deals_view: {
        Row: {
          category_id: number | null
          dealer_id: string | null
          description: string | null
          duration: number | null
          id: string | null
          likes: number | null
          location: unknown | null
          start: string | null
          start_time: string | null
          title: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      invoice_metadata_view: {
        Row: {
          dealer_id: string | null
          deals: number | null
          month: number | null
          total_duration_in_min: number | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
      like_counts_view: {
        Row: {
          deal_id: string | null
          likecount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "active_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "future_deals_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "past_deals_view"
            referencedColumns: ["id"]
          }
        ]
      }
      past_deals_view: {
        Row: {
          category_id: number | null
          dealer_id: string | null
          description: string | null
          duration: number | null
          id: string | null
          likes: number | null
          location: unknown | null
          start: string | null
          start_time: string | null
          title: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_dealer_id_fkey"
            columns: ["dealer_id"]
            referencedRelation: "dealer_view"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_active_deals_within_extent: {
        Args: {
          p_location?: number[]
          p_radius?: number
          p_extent?: number[]
        }
        Returns: {
          category_id: number | null
          dealer_id: string | null
          description: string | null
          duration: number | null
          id: string | null
          likes: number | null
          location: unknown | null
          start: string | null
          start_time: string | null
          title: string | null
          username: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

