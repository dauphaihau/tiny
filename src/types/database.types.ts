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
      follows: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
          id: number
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
          id?: number
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "following_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "following_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
          post_id: number
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: number
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string
          created_at: string
          entity_id: number
          entity_type: string
          id: number
          notification_type: string
          profile_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          entity_id: number
          entity_type: string
          id?: number
          notification_type: string
          profile_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          entity_id?: number
          entity_type?: string
          id?: number
          notification_type?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_images: {
        Row: {
          created_at: string
          height: number | null
          id: number
          image_path: string
          post_id: number
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: number
          image_path: string
          post_id: number
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: number
          image_path?: string
          post_id?: number
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: number
          parent_id: number | null
          profile_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          parent_id?: number | null
          profile_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          parent_id?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          first_name: string
          id: string
          last_name: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          first_name: string
          id: string
          last_name?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_detail_post: {
        Args: {
          post_id: number
          current_profile_id: string
        }
        Returns: {
          id: number
          content: string
          created_at: string
          profile: Json
          images: Json
          likes_count: number
          replies_count: number
          is_liked: boolean
        }[]
      }
      get_last_messages: {
        Args: {
          current_profile_id: string
          page_number?: number
          items_per_page?: number
        }
        Returns: Json
      }
      get_messages: {
        Args: {
          current_profile_id: string
          other_profile_id: string
          page_number?: number
          items_per_page?: number
        }
        Returns: Json
      }
      get_notifications:
        | {
            Args: {
              target_profile_id: string
              filter_type?: string
              page_number?: number
              items_per_page?: number
            }
            Returns: {
              notifications: Json
              pagination: Json
            }[]
          }
        | {
            Args: {
              target_profile_id: string
              page_number?: number
              items_per_page?: number
            }
            Returns: {
              notifications: Json
              pagination: Json
            }[]
          }
      get_posts: {
        Args: {
          current_profile_id: string
          page_number?: number
          items_per_page?: number
          type?: string
        }
        Returns: Json
      }
      get_posts_by_profile: {
        Args: {
          target_profile_id: string
          current_profile_id: string
          type: string
          page_number?: number
          items_per_page?: number
        }
        Returns: Json
      }
      get_profile_by_id: {
        Args: {
          profile_id: string
          current_profile_id: string
        }
        Returns: {
          id: string
          first_name: string
          last_name: string
          avatar: string
          bio: string
          username: string
          followers_count: number
          following_count: number
          is_following: boolean
          posts_count: number
        }[]
      }
      get_replies_post: {
        Args: {
          parent_id: number
          current_profile_id: string
          page_number?: number
          items_per_page?: number
        }
        Returns: Json
      }
      get_unfollowed_profiles: {
        Args: {
          current_profile_id: string
          page_number?: number
          items_per_page?: number
        }
        Returns: {
          id: string
          first_name: string
          avatar: string
          username: string
          bio: string
        }[]
      }
      search_posts: {
        Args: {
          search_term: string
          current_profile_id: string
          latest?: boolean
          items_per_page?: number
          page_number?: number
        }
        Returns: {
          id: number
          parent_id: number
          content: string
          created_at: string
          profile: Json
          likes_count: number
          is_liked: boolean
          images: Json
        }[]
      }
      search_profiles: {
        Args: {
          search_term: string
          current_profile_id: string
          items_per_page: number
          page_number: number
        }
        Returns: {
          id: string
          first_name: string
          avatar: string
          username: string
          is_following: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      image_type: {
        id: number | null
        image_path: string | null
      }
      profile_type: {
        id: string | null
        avatar: string | null
        username: string | null
      }
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
