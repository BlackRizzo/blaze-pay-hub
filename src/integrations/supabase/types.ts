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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bots: {
        Row: {
          created_at: string
          handle: string
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      native_pixels: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          pixel_id: string
          provider: string
          randomizer_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          pixel_id: string
          provider: string
          randomizer_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          pixel_id?: string
          provider?: string
          randomizer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "native_pixels_randomizer_id_fkey"
            columns: ["randomizer_id"]
            isOneToOne: false
            referencedRelation: "randomizers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          plan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          plan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          plan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      randomizer_bots: {
        Row: {
          bot_id: string
          created_at: string
          id: string
          is_reserve: boolean
          randomizer_id: string
          sort_order: number
          weight: number
        }
        Insert: {
          bot_id: string
          created_at?: string
          id?: string
          is_reserve?: boolean
          randomizer_id: string
          sort_order?: number
          weight?: number
        }
        Update: {
          bot_id?: string
          created_at?: string
          id?: string
          is_reserve?: boolean
          randomizer_id?: string
          sort_order?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "randomizer_bots_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "randomizer_bots_randomizer_id_fkey"
            columns: ["randomizer_id"]
            isOneToOne: false
            referencedRelation: "randomizers"
            referencedColumns: ["id"]
          },
        ]
      }
      randomizers: {
        Row: {
          active: boolean
          cloaker_enabled: boolean
          created_at: string
          id: string
          mode: string
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          cloaker_enabled?: boolean
          created_at?: string
          id?: string
          mode?: string
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          cloaker_enabled?: boolean
          created_at?: string
          id?: string
          mode?: string
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          bot_id: string | null
          created_at: string
          currency: string
          id: string
          user_id: string
        }
        Insert: {
          amount?: number
          bot_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          bot_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      utmify_configs: {
        Row: {
          api_token: string | null
          created_at: string
          enabled: boolean
          id: string
          pixel_script: string | null
          randomizer_id: string
          updated_at: string
          utm_script: string | null
        }
        Insert: {
          api_token?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          pixel_script?: string | null
          randomizer_id: string
          updated_at?: string
          utm_script?: string | null
        }
        Update: {
          api_token?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          pixel_script?: string | null
          randomizer_id?: string
          updated_at?: string
          utm_script?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "utmify_configs_randomizer_id_fkey"
            columns: ["randomizer_id"]
            isOneToOne: true
            referencedRelation: "randomizers"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          bot_id: string | null
          created_at: string
          hour: number
          id: string
          randomizer_id: string | null
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          created_at?: string
          hour: number
          id?: string
          randomizer_id?: string | null
          user_id: string
        }
        Update: {
          bot_id?: string | null
          created_at?: string
          hour?: number
          id?: string
          randomizer_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_randomizer_id_fkey"
            columns: ["randomizer_id"]
            isOneToOne: false
            referencedRelation: "randomizers"
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
