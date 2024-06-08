export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billboards: {
        Row: {
          created_at: string
          id: string
          image_url: string
          label: string
          store_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          label: string
          store_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          label?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billboard_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          billboard_id: string
          created_at: string
          id: string
          name: string
          store_id: string
        }
        Insert: {
          billboard_id: string
          created_at?: string
          id?: string
          name: string
          store_id: string
        }
        Update: {
          billboard_id?: string
          created_at?: string
          id?: string
          name?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_billboard_id_fkey"
            columns: ["billboard_id"]
            isOneToOne: false
            referencedRelation: "billboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      colors: {
        Row: {
          created_at: string
          id: string
          name: string
          store_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          store_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          store_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "colors_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string
          id: string
          is_paid: boolean
          phone: string
          store_id: string
        }
        Insert: {
          address?: string
          created_at?: string
          id?: string
          is_paid?: boolean
          phone?: string
          store_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_paid?: boolean
          phone?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          color_id: string
          created_at: string
          id: string
          is_archived: boolean
          is_featured: boolean
          name: string
          price: number
          size_id: string
          store_id: string
        }
        Insert: {
          category_id: string
          color_id: string
          created_at?: string
          id?: string
          is_archived: boolean
          is_featured: boolean
          name: string
          price: number
          size_id: string
          store_id: string
        }
        Update: {
          category_id?: string
          color_id?: string
          created_at?: string
          id?: string
          is_archived?: boolean
          is_featured?: boolean
          name?: string
          price?: number
          size_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products_images: {
        Row: {
          created_at: string
          id: string
          product_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          created_at: string
          id: string
          name: string
          store_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          store_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          store_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "sizes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Stores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never