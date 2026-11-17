import { NextResponse, type NextRequest } from "next/server";
import { EMAIL, fail, notConfigured } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const bad = notConfigured();
  if (bad) return bad;
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category");
  const q = sp.get("q")?.replace(/[,()%*\\]/g, " ").trim();
  const limit = Math.min(Number(sp.get("limit")) || 50, 100);

  let query = supabase.from("listings").select("*").order("created_at", { ascending: false }).limit(limit);
  if (category) query = query.eq("category", category);
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return fail(error.message, 500);
  return NextResponse.json({ listings: data }, { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } });
}

export async function POST(req: NextRequest) {
  const bad = notConfigured();
  if (bad) return bad;
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return fail("Invalid JSON body."); }

  const title = typeof b.title === "string" ? b.title.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const price = Number(b.price);
  const category = typeof b.category === "string" ? b.category : "";
  const seller_email = typeof b.seller_email === "string" ? b.seller_email.trim() : "";
  const image_url = typeof b.image_url === "string" && b.image_url ? b.image_url : null;

  if (!title || title.length > 255) return fail("Title is required (max 255 characters).");
  if (!Number.isFinite(price) || price < 0 || price > 99999999.99) return fail("Enter a valid price.");
  if (!CATEGORIES.includes(category)) return fail("Choose a valid category.");
  if (!EMAIL.test(seller_email)) return fail("Enter a valid email address.");
  // only accept images that came from our own storage
  if (image_url && !image_url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/`)) return fail("Invalid image URL.");

  const { data, error } = await supabase.from("listings")
    .insert({ title, description, price, category, seller_email, image_url }).select().single();
  if (error) return fail(error.message, 500);
  return NextResponse.json({ listing: data }, { status: 201 });
}
