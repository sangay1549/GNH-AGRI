// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
// supabase.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  image_url?: string;
  description: string;
  status: string; // 1. ADD THIS FIELD HERE
  created_at?: string;
}

// Define the Database schema
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product; 
        Insert: Omit<Product, 'id' | 'created_at'>;
        // 2. This Update type now automatically includes status
        Update: Partial<Omit<Product, 'id' | 'created_at'>>; 
      };
    };
  };
}
// These values come from your Supabase Dashboard
// Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in .env file");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);