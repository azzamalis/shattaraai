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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_cache: {
        Row: {
          cache_key: string
          content_hash: string
          created_at: string
          expires_at: string
          hit_count: number
          id: string
          model_name: string
          response_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          cache_key: string
          content_hash: string
          created_at?: string
          expires_at: string
          hit_count?: number
          id?: string
          model_name: string
          response_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          cache_key?: string
          content_hash?: string
          created_at?: string
          expires_at?: string
          hit_count?: number
          id?: string
          model_name?: string
          response_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_rate_limits: {
        Row: {
          chat_tokens: number
          created_at: string
          exam_tokens: number
          id: string
          last_reset_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_tokens?: number
          created_at?: string
          exam_tokens?: number
          id?: string
          last_reset_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_tokens?: number
          created_at?: string
          exam_tokens?: number
          id?: string
          last_reset_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_counters: {
        Row: {
          chat_requests: number
          created_at: string
          date: string
          exam_generations: number
          id: string
          plan_type: Database["public"]["Enums"]["user_plan"]
          total_cost_usd: number
          total_tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_requests?: number
          created_at?: string
          date?: string
          exam_generations?: number
          id?: string
          plan_type?: Database["public"]["Enums"]["user_plan"]
          total_cost_usd?: number
          total_tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_requests?: number
          created_at?: string
          date?: string
          exam_generations?: number
          id?: string
          plan_type?: Database["public"]["Enums"]["user_plan"]
          total_cost_usd?: number
          total_tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
        Relationships: [
          {
            foreignKeyName: "fk_chat_conversations_content"
            columns: ["context_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
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
      contact_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          ai_summary: string | null
          chapters: Json | null
          created_at: string
          filename: string | null
          id: string
          metadata: Json | null
          processing_status: string | null
          room_id: string | null
          storage_path: string | null
          summary_generated_at: string | null
          summary_key_points: Json | null
          text_content: string | null
          thumbnail_url: string | null
          title: string
          transcription_confidence: number | null
          type: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          chapters?: Json | null
          created_at?: string
          filename?: string | null
          id?: string
          metadata?: Json | null
          processing_status?: string | null
          room_id?: string | null
          storage_path?: string | null
          summary_generated_at?: string | null
          summary_key_points?: Json | null
          text_content?: string | null
          thumbnail_url?: string | null
          title: string
          transcription_confidence?: number | null
          type: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          chapters?: Json | null
          created_at?: string
          filename?: string | null
          id?: string
          metadata?: Json | null
          processing_status?: string | null
          room_id?: string | null
          storage_path?: string | null
          summary_generated_at?: string | null
          summary_key_points?: Json | null
          text_content?: string | null
          thumbnail_url?: string | null
          title?: string
          transcription_confidence?: number | null
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
      exam_answers: {
        Row: {
          created_at: string
          exam_attempt_id: string
          id: string
          is_correct: boolean
          points_earned: number
          question_id: string
          updated_at: string
          user_answer: string | null
        }
        Insert: {
          created_at?: string
          exam_attempt_id: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          question_id: string
          updated_at?: string
          user_answer?: string | null
        }
        Update: {
          created_at?: string
          exam_attempt_id?: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          question_id?: string
          updated_at?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_exam_answers_attempt"
            columns: ["exam_attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exam_answers_question"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          exam_id: string | null
          id: string
          max_score: number
          skipped_questions: number | null
          started_at: string
          status: Database["public"]["Enums"]["exam_attempt_status"]
          time_taken_minutes: number | null
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exam_id?: string | null
          id?: string
          max_score?: number
          skipped_questions?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["exam_attempt_status"]
          time_taken_minutes?: number | null
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exam_id?: string | null
          id?: string
          max_score?: number
          skipped_questions?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["exam_attempt_status"]
          time_taken_minutes?: number | null
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_exam_attempts_exam"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          correct_answer: string
          created_at: string
          exam_id: string
          explanation: string | null
          feedback: string | null
          id: string
          options: Json | null
          order_index: number
          points: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          reference_source: string | null
          reference_time: string | null
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          exam_id: string
          explanation?: string | null
          feedback?: string | null
          id?: string
          options?: Json | null
          order_index: number
          points?: number
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"]
          reference_source?: string | null
          reference_time?: string | null
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          exam_id?: string
          explanation?: string | null
          feedback?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          points?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          reference_source?: string | null
          reference_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_exam_questions_exam"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          content_metadata: Json | null
          created_at: string
          description: string | null
          id: string
          room_id: string
          time_limit_minutes: number | null
          title: string
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content_metadata?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          room_id: string
          time_limit_minutes?: number | null
          title: string
          total_questions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content_metadata?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          room_id?: string
          time_limit_minutes?: number | null
          title?: string
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_exams_room"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          concept: string
          content_id: string
          created_at: string | null
          difficulty: string
          explanation: string | null
          hint: string | null
          id: string
          question: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer: string
          concept: string
          content_id: string
          created_at?: string | null
          difficulty: string
          explanation?: string | null
          hint?: string | null
          id?: string
          question: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          concept?: string
          content_id?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          hint?: string | null
          id?: string
          question?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
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
      profile_audit_log: {
        Row: {
          action: string
          changed_fields: Json | null
          created_at: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          changed_fields?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changed_fields?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
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
          plan_type: Database["public"]["Enums"]["user_plan"]
          purpose: Database["public"]["Enums"]["user_purpose"] | null
          source: Database["public"]["Enums"]["user_source"] | null
          theme_preference: string | null
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
          plan_type?: Database["public"]["Enums"]["user_plan"]
          purpose?: Database["public"]["Enums"]["user_purpose"] | null
          source?: Database["public"]["Enums"]["user_source"] | null
          theme_preference?: string | null
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
          plan_type?: Database["public"]["Enums"]["user_plan"]
          purpose?: Database["public"]["Enums"]["user_purpose"] | null
          source?: Database["public"]["Enums"]["user_source"] | null
          theme_preference?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          config: Json | null
          content_id: string
          created_at: string | null
          id: string
          questions: Json
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config?: Json | null
          content_id: string
          created_at?: string | null
          id?: string
          questions: Json
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config?: Json | null
          content_id?: string
          created_at?: string | null
          id?: string
          questions?: Json
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      recordings: {
        Row: {
          audio_chunks_processed: number | null
          audio_file_path: string | null
          chapters: Json | null
          content_id: string | null
          created_at: string
          duration: number | null
          id: string
          processing_status: string | null
          real_time_transcript: Json | null
          transcript: string | null
          transcription_confidence: number | null
          transcription_progress: number | null
          transcription_status: string | null
          updated_at: string
          waveform_data: Json | null
        }
        Insert: {
          audio_chunks_processed?: number | null
          audio_file_path?: string | null
          chapters?: Json | null
          content_id?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          processing_status?: string | null
          real_time_transcript?: Json | null
          transcript?: string | null
          transcription_confidence?: number | null
          transcription_progress?: number | null
          transcription_status?: string | null
          updated_at?: string
          waveform_data?: Json | null
        }
        Update: {
          audio_chunks_processed?: number | null
          audio_file_path?: string | null
          chapters?: Json | null
          content_id?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          processing_status?: string | null
          real_time_transcript?: Json | null
          transcript?: string | null
          transcription_confidence?: number | null
          transcription_progress?: number | null
          transcription_status?: string | null
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      summaries: {
        Row: {
          content_id: string
          created_at: string
          id: string
          key_points: Json | null
          summary: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          key_points?: Json | null
          summary: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          key_points?: Json | null
          summary?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summaries_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
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
      check_rate_limit: {
        Args: {
          estimated_tokens?: number
          request_type: string
          user_uuid: string
        }
        Returns: {
          allowed: boolean
          plan_type: Database["public"]["Enums"]["user_plan"]
          remaining_requests: number
          reset_time: string
        }[]
      }
      cleanup_expired_cache: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      generate_invite_code: { Args: never; Returns: string }
      get_user_plan_quotas: {
        Args: { user_uuid: string }
        Returns: {
          cache_duration_hours: number
          daily_chat_limit: number
          daily_exam_limit: number
          plan_type: Database["public"]["Enums"]["user_plan"]
        }[]
      }
      user_owns_content: { Args: { c_id: string }; Returns: boolean }
      user_owns_exam: { Args: { exam_uuid: string }; Returns: boolean }
      user_owns_exam_attempt: {
        Args: { attempt_uuid: string }
        Returns: boolean
      }
      user_owns_exam_via_question: {
        Args: { question_uuid: string }
        Returns: boolean
      }
      user_owns_room_for_exam: { Args: { exam_uuid: string }; Returns: boolean }
      validate_invite_code: {
        Args: { code: string }
        Returns: {
          is_valid: boolean
          referrer_id: string
        }[]
      }
      validate_profile_access: {
        Args: { profile_id: string }
        Returns: boolean
      }
    }
    Enums: {
      conversation_type:
        | "general"
        | "content_discussion"
        | "room_collaboration"
        | "exam_support"
      exam_attempt_status: "in_progress" | "completed" | "abandoned"
      message_type: "text" | "system" | "ai_response" | "user_query"
      question_type: "multiple_choice" | "free_text"
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
      user_plan: "free" | "pro" | "enterprise"
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
      exam_attempt_status: ["in_progress", "completed", "abandoned"],
      message_type: ["text", "system", "ai_response", "user_query"],
      question_type: ["multiple_choice", "free_text"],
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
      user_plan: ["free", "pro", "enterprise"],
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
