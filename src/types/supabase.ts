export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      positions: {
        Row: {
          id: string
          user_id: string
          instrument_id: string
          instrument_type: string
          quantity: number
          entry_price: number
          current_price: number
          unrealized_pnl: number
          open_time: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instrument_id: string
          instrument_type: string
          quantity: number
          entry_price: number
          current_price: number
          unrealized_pnl: number
          open_time?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          instrument_id?: string
          instrument_type?: string
          quantity?: number
          entry_price?: number
          current_price?: number
          unrealized_pnl?: number
          open_time?: string
          created_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          instrument_id: string
          instrument_type: string
          side: 'BUY' | 'SELL'
          quantity: number
          price: number
          pnl: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instrument_id: string
          instrument_type: string
          side: 'BUY' | 'SELL'
          quantity: number
          price: number
          pnl: number
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          instrument_id?: string
          instrument_type?: string
          side?: 'BUY' | 'SELL'
          quantity?: number
          price?: number
          pnl?: number
          timestamp?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          balance: number
          daily_pnl: number
          total_pnl: number
          win_rate: number
          rank: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          daily_pnl?: number
          total_pnl?: number
          win_rate?: number
          rank?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          daily_pnl?: number
          total_pnl?: number
          win_rate?: number
          rank?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}