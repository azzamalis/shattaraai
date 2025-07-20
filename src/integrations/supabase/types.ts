export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          context_id: string | null
          context_type: string | null
          created_at: string
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          metadata: Json | null
          title: string | null
          type: Database["public"]["Enums"]["conversation_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          title?: string | null
          type?: Database["public"]["Enums"]["conversation_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          title?: string | null
          type?: Database["public"]["Enums"]["conversation_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          metadata: Json | null
          sender_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          sender_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          sender_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          created_at: string
          filename: string | null
          id: string
          metadata: Json | null
          room_id: string | null
          storage_path: string | null
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
          storage_path?: string | null
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
          storage_path?: string | null
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
      newsletter_subscribers: {
        Row: {
          confirmation_token: string | null
          created_at: string
          email: string
          id: string
          status: string
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          confirmation_token?: string | null
          created_at?: string
          email: string
          id?: string
          status?: string
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          confirmation_token?: string | null
          created_at?: string
          email?: string
          id?: string
          status?: string
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
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
      referral_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          invite_code: string
          ip_address: unknown | null
          metadata: Json | null
          referee_user_id: string | null
          referrer_user_id: string
          user_agent: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          invite_code: string
          ip_address?: unknown | null
          metadata?: Json | null
          referee_user_id?: string | null
          referrer_user_id: string
          user_agent?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          invite_code?: string
          ip_address?: unknown | null
          metadata?: Json | null
          referee_user_id?: string | null
          referrer_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          referral_activity_id: string
          reward_type: string
          reward_value: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          referral_activity_id: string
          reward_type: string
          reward_value?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          referral_activity_id?: string
          reward_type?: string
          reward_value?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_activity_id_fkey"
            columns: ["referral_activity_id"]
            isOneToOne: false
            referencedRelation: "referral_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          created_at: string
          id: string
          invite_code: string
          is_active: boolean
          successful_referrals: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_code: string
          is_active?: boolean
          successful_referrals?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_code?: string
          is_active?: boolean
          successful_referrals?: number
          total_referrals?: number
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
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      conversation_type:
        | "general"
        | "content_discussion"
        | "room_collaboration"
        | "exam_support"
      message_type: "text" | "system" | "ai_response" | "user_query"
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
      conversation_type: [
        "general",
        "content_discussion",
        "room_collaboration",
        "exam_support",
      ],
      message_type: ["text", "system", "ai_response", "user_query"],
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
