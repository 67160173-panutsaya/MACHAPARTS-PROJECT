import { createClient } from '@supabase/supabase-js';

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://thbwybzlrzducxzmuhqg.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYnd5YnpscnpkdWN4em11aHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTE3MDIsImV4cCI6MjEwMjg2NzcwMn0.azjO3qUKaKXzL8oYUufSuNMlm980Y_-hI2xQOX3aeYM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Part = {
  id: string;
  name: string;
  brand: string;
  category: string;
  compatibility: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  rating: number;
  review_count: number;
  stock_status: string;
  image_url: string;
  badge: string | null;
  is_featured: boolean;
  created_at: string;
};
