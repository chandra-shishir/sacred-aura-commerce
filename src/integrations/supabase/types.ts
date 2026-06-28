export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      course_announcements: {
        Row: {
          author_id: string
          body: string
          course_id: string
          created_at: string
          id: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          course_id: string
          created_at?: string
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          course_id?: string
          created_at?: string
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          created_at: string
          enrolled_at: string
          expires_at: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_preview: boolean
          live_class_url: string | null
          module_id: string
          pdf_url: string | null
          position: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_preview?: boolean
          live_class_url?: string | null
          module_id: string
          pdf_url?: string | null
          position?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_preview?: boolean
          live_class_url?: string | null
          module_id?: string
          pdf_url?: string | null
          position?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          position: number
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          position?: number
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          position?: number
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          benefits: string[] | null
          category: string | null
          created_at: string
          currency: string
          description: string | null
          duration: string | null
          enrollment_count: number | null
          id: string
          image_url: string | null
          instructor: string | null
          is_featured: boolean | null
          is_published: boolean | null
          level: string | null
          modules: Json | null
          mrp: number | null
          price: number
          rating: number | null
          reviews_count: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration?: string | null
          enrollment_count?: number | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string | null
          modules?: Json | null
          mrp?: number | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          duration?: string | null
          enrollment_count?: number | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          level?: string | null
          modules?: Json | null
          mrp?: number | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          lesson_id: string
          updated_at: string
          user_id: string
          watch_seconds: number
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          lesson_id: string
          updated_at?: string
          user_id: string
          watch_seconds?: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watch_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
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
          created_at: string
          currency: string
          guest_email: string | null
          id: string
          notes: string | null
          payment_intent_id: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          guest_email?: string | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          guest_email?: string | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          benefits: string[] | null
          category: string
          category_id: string | null
          created_at: string
          crystal_type: string | null
          currency: string
          description: string | null
          discount_percent: number | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          mrp: number | null
          name: string
          price: number
          rating: number | null
          reviews_count: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          specifications: Json | null
          spiritual_meaning: string | null
          stock: number | null
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          benefits?: string[] | null
          category: string
          category_id?: string | null
          created_at?: string
          crystal_type?: string | null
          currency?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          mrp?: number | null
          name: string
          price: number
          rating?: number | null
          reviews_count?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          specifications?: Json | null
          spiritual_meaning?: string | null
          stock?: number | null
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          benefits?: string[] | null
          category?: string
          category_id?: string | null
          created_at?: string
          crystal_type?: string | null
          currency?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          mrp?: number | null
          name?: string
          price?: number
          rating?: number | null
          reviews_count?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          specifications?: Json | null
          spiritual_meaning?: string | null
          stock?: number | null
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
