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
      application_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      document_analyses: {
        Row: {
          analysis_results: Json
          created_at: string | null
          document_text: string
          id: string
          updated_at: string | null
        }
        Insert: {
          analysis_results: Json
          created_at?: string | null
          document_text: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          analysis_results?: Json
          created_at?: string | null
          document_text?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      examination_certificates: {
        Row: {
          created_at: string
          exam_completion_date: string | null
          exam_name: string
          exam_type: string
          file_url: string | null
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_completion_date?: string | null
          exam_name: string
          exam_type: string
          file_url?: string | null
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_completion_date?: string | null
          exam_name?: string
          exam_type?: string
          file_url?: string | null
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_roles: {
        Row: {
          certification_level: Database["public"]["Enums"]["certification_level"]
          id: string
          industry_segment: string
          required_tscs: number
          title: string
        }
        Insert: {
          certification_level?: Database["public"]["Enums"]["certification_level"]
          id?: string
          industry_segment: string
          required_tscs?: number
          title: string
        }
        Update: {
          certification_level?: Database["public"]["Enums"]["certification_level"]
          id?: string
          industry_segment?: string
          required_tscs?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      regulatory_exams: {
        Row: {
          completion_date: string
          created_at: string | null
          exam_name: string
          exam_type: Database["public"]["Enums"]["exam_type"] | null
          file_size: number | null
          id: string
          result_slip_url: string | null
          user_id: string | null
        }
        Insert: {
          completion_date: string
          created_at?: string | null
          exam_name: string
          exam_type?: Database["public"]["Enums"]["exam_type"] | null
          file_size?: number | null
          id?: string
          result_slip_url?: string | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string
          created_at?: string | null
          exam_name?: string
          exam_type?: Database["public"]["Enums"]["exam_type"] | null
          file_size?: number | null
          id?: string
          result_slip_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          program_name: string
          provider_name: string
          validity_end: string
          validity_start: string
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          program_name: string
          provider_name: string
          validity_end: string
          validity_start: string
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          program_name?: string
          provider_name?: string
          validity_end?: string
          validity_start?: string
        }
        Relationships: []
      }
      user_certifications: {
        Row: {
          application_type: Database["public"]["Enums"]["application_type"]
          created_at: string | null
          id: string
          industry_segment: string
          job_role_id: string | null
          segment_experience_years: number
          status: string
          total_experience_years: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_type?: Database["public"]["Enums"]["application_type"]
          created_at?: string | null
          id?: string
          industry_segment: string
          job_role_id?: string | null
          segment_experience_years: number
          status?: string
          total_experience_years: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_type?: Database["public"]["Enums"]["application_type"]
          created_at?: string | null
          id?: string
          industry_segment?: string
          job_role_id?: string | null
          segment_experience_years?: number
          status?: string
          total_experience_years?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_training_programs: {
        Row: {
          certificate_url: string | null
          certification_id: string | null
          commencement_date: string
          completion_date: string
          created_at: string | null
          id: string
          training_program_id: string | null
          user_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          certification_id?: string | null
          commencement_date: string
          completion_date: string
          created_at?: string | null
          id?: string
          training_program_id?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          certification_id?: string | null
          commencement_date?: string
          completion_date?: string
          created_at?: string | null
          id?: string
          training_program_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_training_programs_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "user_certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_training_programs_training_program_id_fkey"
            columns: ["training_program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_service_config: {
        Args: {
          service_name: string
        }
        Returns: Json
      }
    }
    Enums: {
      application_type: "certification" | "funding" | "exemption"
      certification_level: "qualified" | "advanced-2" | "advanced-3"
      exam_type: "CMFAS_M8" | "CMFAS_M9" | "CMFAS_M10"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
