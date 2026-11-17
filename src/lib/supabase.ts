import { createClient } from "@supabase/supabase-js";

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
// placeholders let the build succeed without env vars; API routes refuse to run without real ones
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
);

export type Listing = {
  id: string; title: string; description: string | null; price: number | string;
  category: string; seller_email: string; image_url: string | null;
  location: string; created_at: string;
};
