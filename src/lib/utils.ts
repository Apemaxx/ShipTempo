import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

/**
 * Creates and returns a Supabase client instance
 */
export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey);
}
