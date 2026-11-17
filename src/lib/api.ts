import { NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
export const notConfigured = () =>
  supabaseConfigured
    ? null
    : fail("Supabase isn't configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.", 503);
