import { NextResponse, type NextRequest } from "next/server";
import { fail, notConfigured } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const bad = notConfigured();
  if (bad) return bad;
  const { id } = await params;
  if (!UUID.test(id)) return fail("Listing not found.", 404);
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  if (error) return fail(error.message, 500);
  if (!data) return fail("Listing not found.", 404);
  return NextResponse.json({ listing: data });
}
