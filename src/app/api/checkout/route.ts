import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { fail, notConfigured } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const noStripe = () => fail("Payments aren't configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server.", 503);

console.log("len:", process.env.STRIPE_SECRET_KEY?.length, "stripe is null:", !stripe);
// Start a hosted Stripe Checkout for one listing. The price always comes from the database, never from the browser.
export async function POST(req: NextRequest) {
  const bad = notConfigured();
  if (bad) return bad;
  if (!stripe) return noStripe();

  const body = await req.json().catch(() => null);
  const id = typeof body?.listing_id === "string" ? body.listing_id : "";
  if (!UUID.test(id)) return fail("Invalid listing.");

  const { data: listing, error } = await supabase.from("listings").select("id, title, price, image_url").eq("id", id).maybeSingle();
  if (error) return fail(error.message, 500);
  if (!listing) return fail("Listing not found.", 404);

  const cents = Math.round(Number(listing.price) * 100);
  if (cents < 50) return fail("Stripe can't charge less than $0.50. Message the seller instead.");

  const origin = req.nextUrl.origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cents,
          product_data: { name: String(listing.title).slice(0, 200), images: listing.image_url ? [listing.image_url] : undefined },
        },
      }],
      metadata: { listing_id: listing.id },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/item/${listing.id}?checkout=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe error:", e);
    return fail(e instanceof Error ? e.message : "Couldn't start checkout.", 502);
  }
}

// Confirm a finished checkout, so the success message isn't just a URL anyone could type.
export async function GET(req: NextRequest) {
  if (!stripe) return noStripe();
  const sessionId = req.nextUrl.searchParams.get("session_id") ?? "";
  const listingId = req.nextUrl.searchParams.get("listing_id") ?? "";
  if (!sessionId.startsWith("cs_")) return fail("Invalid session.");
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ paid: session.payment_status === "paid" && session.metadata?.listing_id === listingId });
  } catch {
    return NextResponse.json({ paid: false });
  }
}