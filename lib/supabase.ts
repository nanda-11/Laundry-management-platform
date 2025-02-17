import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type LaundryOrder = {
  id: string
  user_id: string
  status: "pending" | "processing" | "ready" | "completed"
  ironing: boolean
  delivery_date: string
  created_at: string
}

export type Issue = {
  id: string
  user_id: string
  title: string
  description: string
  status: "open" | "closed"
  created_at: string
}

