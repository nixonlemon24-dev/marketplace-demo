import { NextResponse, type NextRequest } from "next/server";
import { fail, notConfigured } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function POST(req: NextRequest) {
  const bad = notConfigured();
  if (bad) return bad;
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return fail("No file uploaded.");
  const ext = TYPES[file.type];
  if (!ext) return fail("Use a JPG, PNG, WebP or GIF image.");
  if (file.size > 5 * 1024 * 1024) return fail("The image must be under 5 MB.");

  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("listing-images").upload(path, file, { contentType: file.type });
  if (error) return fail(`Upload failed: ${error.message}`, 500);
  return NextResponse.json({ url: supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl }, { status: 201 });
}
