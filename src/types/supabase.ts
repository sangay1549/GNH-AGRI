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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agricultural_products: {
        Row: {
          average_price_per_kg: number | null
          category: string | null
          growth_duration_days: number | null
          id: number
          ideal_ph_max: number | null
          ideal_ph_min: number | null
          lunar: string | null
          market_demand_level: string | null
          max_temp: number | null
          min_rainfall_mm: number | null
          min_temp: number | null
          modern: string | null
          modern_window: string | null
          name: string
          optimal_altitude_meters: number | null
          planting_season: string | null
          progress: number | null
          recommendation_reason: string | null
          status: string | null
          steps: Json | null
          tools: Json | null
        }
        Insert: {
          average_price_per_kg?: number | null
          category?: string | null
          growth_duration_days?: number | null
          id?: number
          ideal_ph_max?: number | null
          ideal_ph_min?: number | null
          lunar?: string | null
          market_demand_level?: string | null
          max_temp?: number | null
          min_rainfall_mm?: number | null
          min_temp?: number | null
          modern?: string | null
          modern_window?: string | null
          name: string
          optimal_altitude_meters?: number | null
          planting_season?: string | null
          progress?: number | null
          recommendation_reason?: string | null
          status?: string | null
          steps?: Json | null
          tools?: Json | null
        }
        Update: {
          average_price_per_kg?: number | null
          category?: string | null
          growth_duration_days?: number | null
          id?: number
          ideal_ph_max?: number | null
          ideal_ph_min?: number | null
          lunar?: string | null
          market_demand_level?: string | null
          max_temp?: number | null
          min_rainfall_mm?: number | null
          min_temp?: number | null
          modern?: string | null
          modern_window?: string | null
          name?: string
          optimal_altitude_meters?: number | null
          planting_season?: string | null
          progress?: number | null
          recommendation_reason?: string | null
          status?: string | null
          steps?: Json | null
          tools?: Json | null
        }
        Relationships: []
      }
      crop_guides: {
        Row: {
          crop_name: string
          id: string
          steps: Json
          tools: Json
        }
        Insert: {
          crop_name: string
          id?: string
          steps: Json
          tools: Json
        }
        Update: {
          crop_name?: string
          id?: string
          steps?: Json
          tools?: Json
        }
        Relationships: []
      }
      crop_wisdom: {
        Row: {
          advice: string | null
          crop_name: string
          gregorian_end: string | null
          gregorian_start: string | null
          id: string
          lunar_month_end: number | null
          lunar_month_start: number | null
        }
        Insert: {
          advice?: string | null
          crop_name: string
          gregorian_end?: string | null
          gregorian_start?: string | null
          id?: string
          lunar_month_end?: number | null
          lunar_month_start?: number | null
        }
        Update: {
          advice?: string | null
          crop_name?: string
          gregorian_end?: string | null
          gregorian_start?: string | null
          id?: string
          lunar_month_end?: number | null
          lunar_month_start?: number | null
        }
        Relationships: []
      }
      dungkhag: {
        Row: {
          dzongkhag_id: number
          id: number
          name: string
        }
        Insert: {
          dzongkhag_id: number
          id: number
          name: string
        }
        Update: {
          dzongkhag_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "dungkhag_dzongkhag_id_fkey"
            columns: ["dzongkhag_id"]
            isOneToOne: false
            referencedRelation: "dzongkhag"
            referencedColumns: ["id"]
          },
        ]
      }
      dzongkhag: {
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
      dzongkhags: {
        Row: {
          humidity: number | null
          id: number
          moisture: number | null
          name: string
          station: string | null
          temp: number | null
        }
        Insert: {
          humidity?: number | null
          id?: number
          moisture?: number | null
          name: string
          station?: string | null
          temp?: number | null
        }
        Update: {
          humidity?: number | null
          id?: number
          moisture?: number | null
          name?: string
          station?: string | null
          temp?: number | null
        }
        Relationships: []
      }
      dzongkhagweather: {
        Row: {
          elevation_meters: number | null
          id: number
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          elevation_meters?: number | null
          id?: number
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          elevation_meters?: number | null
          id?: number
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      equipment_rentals: {
        Row: {
          created_at: string
          description: string | null
          equipment_type: string
          id: string
          image_url: string | null
          location: string
          price_per_day: number
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          equipment_type: string
          id?: string
          image_url?: string | null
          location: string
          price_per_day: number
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          equipment_type?: string
          id?: string
          image_url?: string | null
          location?: string
          price_per_day?: number
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gewog: {
        Row: {
          dungkhag_id: number | null
          dzongkhag_id: number
          id: number
          name: string
        }
        Insert: {
          dungkhag_id?: number | null
          dzongkhag_id: number
          id: number
          name: string
        }
        Update: {
          dungkhag_id?: number | null
          dzongkhag_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "gewog_dungkhag_id_fkey"
            columns: ["dungkhag_id"]
            isOneToOne: false
            referencedRelation: "dungkhag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gewog_dzongkhag_id_fkey"
            columns: ["dzongkhag_id"]
            isOneToOne: false
            referencedRelation: "dzongkhag"
            referencedColumns: ["id"]
          },
        ]
      }
      market_prices: {
        Row: {
          crop_name: string
          id: string
          location: string | null
          price_nu: number
          recorded_at: string | null
          unit: string | null
        }
        Insert: {
          crop_name: string
          id?: string
          location?: string | null
          price_nu: number
          recorded_at?: string | null
          unit?: string | null
        }
        Update: {
          crop_name?: string
          id?: string
          location?: string | null
          price_nu?: number
          recorded_at?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          seller_id: string | null
          sold_count: number | null
          status: string | null
          stock: number | null
          unit: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          seller_id?: string | null
          sold_count?: number | null
          status?: string | null
          stock?: number | null
          unit: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          seller_id?: string | null
          sold_count?: number | null
          status?: string | null
          stock?: number | null
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      soil_metrics: {
        Row: {
          created_at: string | null
          dzongkhag: string | null
          farmer_id: string | null
          id: string
          moisture: number | null
          nitrogen: number | null
          ph: number | null
        }
        Insert: {
          created_at?: string | null
          dzongkhag?: string | null
          farmer_id?: string | null
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          ph?: number | null
        }
        Update: {
          created_at?: string | null
          dzongkhag?: string | null
          farmer_id?: string | null
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          ph?: number | null
        }
        Relationships: []
      }
      weather_logs: {
        Row: {
          created_at: string | null
          dzongkhag_name: string
          humidity: number | null
          id: string
          temperature: number | null
        }
        Insert: {
          created_at?: string | null
          dzongkhag_name: string
          humidity?: number | null
          id?: string
          temperature?: number | null
        }
        Update: {
          created_at?: string | null
          dzongkhag_name?: string
          humidity?: number | null
          id?: string
          temperature?: number | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
