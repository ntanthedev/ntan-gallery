export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_profile: {
        Row: {
          created_at: string;
          email: string;
          last_login_at: string | null;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          last_login_at?: string | null;
          role?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          last_login_at?: string | null;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      friends: {
        Row: {
          access_key_hash: string;
          created_at: string;
          description: string | null;
          gallery_photos: string[];
          id: string;
          is_published: boolean;
          letter_content: string | null;
          main_photo: string | null;
          name: string;
          nickname: string | null;
          order_index: number;
          slug: string;
          theme_config: Json;
          updated_at: string;
        };
        Insert: {
          access_key_hash: string;
          created_at?: string;
          description?: string | null;
          gallery_photos?: string[];
          id?: string;
          is_published?: boolean;
          letter_content?: string | null;
          main_photo?: string | null;
          name: string;
          nickname?: string | null;
          order_index?: number;
          slug: string;
          theme_config?: Json;
          updated_at?: string;
        };
        Update: {
          access_key_hash?: string;
          created_at?: string;
          description?: string | null;
          gallery_photos?: string[];
          id?: string;
          is_published?: boolean;
          letter_content?: string | null;
          main_photo?: string | null;
          name?: string;
          nickname?: string | null;
          order_index?: number;
          slug?: string;
          theme_config?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      uploads: {
        Row: {
          checksum: string | null;
          created_at: string;
          file_name: string;
          friend_id: string | null;
          height: number | null;
          id: string;
          mime_type: string | null;
          size_bytes: number | null;
          storage_path: string;
          uploaded_by: string | null;
          width: number | null;
        };
        Insert: {
          checksum?: string | null;
          created_at?: string;
          file_name: string;
          friend_id?: string | null;
          height?: number | null;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          storage_path: string;
          uploaded_by?: string | null;
          width?: number | null;
        };
        Update: {
          checksum?: string | null;
          created_at?: string;
          file_name?: string;
          friend_id?: string | null;
          height?: number | null;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          storage_path?: string;
          uploaded_by?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            columns: ["friend_id"];
            referencedRelation: "friends";
            referencedColumns: ["id"];
          },
          {
            columns: ["uploaded_by"];
            referencedRelation: "admin_profile";
            referencedColumns: ["user_id"];
          },
        ];
      };
      access_logs: {
        Row: {
          accessed_at: string;
          failure_reason: string | null;
          friend_id: string;
          id: string;
          ip_address: string | null;
          success: boolean;
          user_agent: string | null;
        };
        Insert: {
          accessed_at?: string;
          failure_reason?: string | null;
          friend_id: string;
          id?: string;
          ip_address?: string | null;
          success?: boolean;
          user_agent?: string | null;
        };
        Update: {
          accessed_at?: string;
          failure_reason?: string | null;
          friend_id?: string;
          id?: string;
          ip_address?: string | null;
          success?: boolean;
          user_agent?: string | null;
        };
        Relationships: [
          {
            columns: ["friend_id"];
            referencedRelation: "friends";
            referencedColumns: ["id"];
          },
        ];
      };
      rate_limits: {
        Row: {
          attempts: number;
          blocked_until: string | null;
          ip: string;
          last_attempt: string;
        };
        Insert: {
          attempts?: number;
          blocked_until?: string | null;
          ip: string;
          last_attempt?: string;
        };
        Update: {
          attempts?: number;
          blocked_until?: string | null;
          ip?: string;
          last_attempt?: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_gallery_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      touch_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

