import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { FormData } from "./constants";

export interface OrderRow {
  id: string;
  package_id: string;
  form_data: FormData;
  status: "pending" | "paid";
  created_at: string;
  paid_at: string | null;
  stripe_session_id: string | null;
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase non configurato: imposta NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}
