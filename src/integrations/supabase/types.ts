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
      content: {
        Row: {
          created_at: string
          filename: string | null
          id: string
          metadata: Json | null
          room_id: string | null
          text_content: string | null
          title: string
          type: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          filename?: string | null
          id?: string
          metadata?: Json | null
          room_id?: string | null
          text_content?: string | null
          title: string
          type: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          filename?: string | null
          id?: string
          metadata?: Json | null
          room_id?: string | null
          text_content?: string | null
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          goal: Database["public"]["Enums"]["user_goal"] | null
          id: string
          language: string
          onboarding_completed: boolean | null
          purpose: Database["public"]["Enums"]["user_purpose"] | null
          source: Database["public"]["Enums"]["user_source"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          goal?: Database["public"]["Enums"]["user_goal"] | null
          id: string
          language?: string
          onboarding_completed?: boolean | null
          purpose?: Database["public"]["Enums"]["user_purpose"] | null
          source?: Database["public"]["Enums"]["user_source"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          goal?: Database["public"]["Enums"]["user_goal"] | null
          id?: string
          language?: string
          onboarding_completed?: boolean | null
          purpose?: Database["public"]["Enums"]["user_purpose"] | null
          source?: Database["public"]["Enums"]["user_source"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          audio_file_path: string | null
          chapters: Json | null
          content_id: string | null
          created_at: string
          duration: number | null
          id: string
          processing_status: string | null
          transcript: string | null
          updated_at: string
          waveform_data: Json | null
        }
        Insert: {
          audio_file_path?: string | null
          chapters?: Json | null
          content_id?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          processing_status?: string | null
          transcript?: string | null
          updated_at?: string
          waveform_data?: Json | null
        }
        Update: {
          audio_file_path?: string | null
          chapters?: Json | null
          content_id?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          processing_status?: string | null
          transcript?: string | null
          updated_at?: string
          waveform_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "recordings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
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
      user_goal:
        | "exam_prep"
        | "homework_help"
        | "concept_learning"
        | "skill_building"
        | "lesson_planning"
        | "content_creation"
        | "student_assessment"
        | "curriculum_design"
        | "career_advancement"
        | "certification_prep"
        | "networking"
        | "leadership_development"
        | "data_analysis"
        | "publication_support"
        | "grant_writing"
        | "collaboration"
      user_purpose: "student" | "teacher" | "professional" | "researcher"
      user_source:
        | "search_engine"
        | "social_media"
        | "referral"
        | "advertisement"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_goal: [
        "exam_prep",
        "homework_help",
        "concept_learning",
        "skill_building",
        "lesson_planning",
        "content_creation",
        "student_assessment",
        "curriculum_design",
        "career_advancement",
        "certification_prep",
        "networking",
        "leadership_development",
        "data_analysis",
        "publication_support",
        "grant_writing",
        "collaboration",
      ],
      user_purpose: ["student", "teacher", "professional", "researcher"],
      user_source: [
        "search_engine",
        "social_media",
        "referral",
        "advertisement",
        "other",
      ],
    },
  },
} as const
