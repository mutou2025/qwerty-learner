export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // 用户学习记录 - 记录每个词库的学习进度
      user_records: {
        Row: {
          id: string
          user_id: string
          dict_id: string
          chapter: number
          word_index: number
          correct_count: number
          wrong_count: number
          last_practice_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dict_id: string
          chapter?: number
          word_index?: number
          correct_count?: number
          wrong_count?: number
          last_practice_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dict_id?: string
          chapter?: number
          word_index?: number
          correct_count?: number
          wrong_count?: number
          last_practice_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 用户设置
      user_settings: {
        Row: {
          user_id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          settings?: Json
          updated_at?: string
        }
      }

      // 个人词库
      user_dictionaries: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          words: Json
          word_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          words: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          words?: Json
          created_at?: string
          updated_at?: string
        }
      }

      // 艾宾浩斯复习记录 (SM-2 算法)
      review_records: {
        Row: {
          id: string
          user_id: string
          word: string
          dict_id: string | null
          ease_factor: number // 简易度因子 >=1.3
          interval: number // 复习间隔 (天)
          repetitions: number // 连续正确次数
          next_review_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          dict_id?: string | null
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          dict_id?: string | null
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 错题记录
      error_words: {
        Row: {
          id: string
          user_id: string
          word: string
          dict_id: string | null
          wrong_count: number
          last_wrong_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          dict_id?: string | null
          wrong_count?: number
          last_wrong_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          dict_id?: string | null
          wrong_count?: number
          last_wrong_at?: string
          created_at?: string
        }
      }

      // 每日学习统计
      daily_stats: {
        Row: {
          id: string
          user_id: string
          date: string
          words_practiced: number
          correct_count: number
          wrong_count: number
          practice_time: number // 秒
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          words_practiced?: number
          correct_count?: number
          wrong_count?: number
          practice_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          words_practiced?: number
          correct_count?: number
          wrong_count?: number
          practice_time?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}

// 便捷类型导出
export type UserRecord = Database['public']['Tables']['user_records']['Row']
export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserDictionary = Database['public']['Tables']['user_dictionaries']['Row']
export type ReviewRecord = Database['public']['Tables']['review_records']['Row']
export type ErrorWord = Database['public']['Tables']['error_words']['Row']
export type DailyStats = Database['public']['Tables']['daily_stats']['Row']

// 单词类型 (个人词库中的单词格式)
export interface WordItem {
  name: string // 单词
  trans: string[] // 释义
  usphone?: string // 美式音标
  ukphone?: string // 英式音标
}
