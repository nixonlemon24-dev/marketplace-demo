import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { stripe } from "@/lib/stripe";
import { supabase, supabaseConfigured, type Listing } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payment successful", robots: { index: false } };

// Ask Stripe directly whether this checkout was paid, so the page can't be faked by typing a URL.
async function load(sessionId?: string) {
  if (!stripe || !sessionId?.startsWith("cs_")) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const listingId = session.metadata?.listing_id;
    let listing: Listing | null = null;
    if (listingId && supabaseConfigured) {
      const { data } = await supabase.from("listings").select("*").eq("id", listingId).maybeSingle();
      listing = (data as Listing | null) ?? null;
    }
    return { session, listing };
  } catch {
    return null;
  }
}

function Message({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-lg p-4 sm:p-8">
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:p-8">
          {icon}
          <h1 className="text-2xl font-extrabold">{title}</h1>
          {children}
        </CardContent>
      </Card>
    </main>
  );
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const result = await load(session_id);
  const home = <Button asChild variant="outline"><Link href="/">Back to Marketplace</Link></Button>;

  if (!result) {
    return (
      <Message icon={<XCircle className="size-12 text-destructive" />} title="We could not confirm this payment">
        <p className="text-sm text-muted-foreground">
          The link may be incomplete, or payments aren&apos;t set up on this server. If you were charged, check the receipt email from Stripe.
        </p>
        {home}
      </Message>
    );
  }

  const { session, listing } = result;

  if (session.payment_status !== "paid") {
    return (
      <Message icon={<Clock className="size-12 text-muted-foreground" />} title="Your payment is processing">
        <p className="text-sm text-muted-foreground">Stripe hasn&apos;t confirmed the payment yet. Some payment methods take a little while. Check back soon.</p>
        {home}
      </Message>
    );
  }

  const amount = session.amount_total != null ? session.amount_total / 100 : listing?.price;

  return (
    <main className="mx-auto max-w-lg p-4 sm:p-8">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <CheckCircle2 className="size-14 text-primary" />
          <div>
            <h1 className="text-2xl font-extrabold">Payment successful</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Thank you!{amount != null && ` Your payment of ${formatPrice(amount)} was received.`}
            </p>
          </div>

          {listing && (
            <div className="flex w-full items-center gap-3 rounded-xl bg-background p-3 text-left">
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {listing.image_url && <img src={listing.image_url} alt="" className="size-full object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{listing.title}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(listing.price)} · {listing.location}</p>
              </div>
            </div>
          )}

          <p className="text-sm">
            Message the seller to arrange pickup or delivery.
            {listing && <> Seller: <a className="text-primary hover:underline" href={`mailto:${listing.seller_email}`}>{listing.seller_email}</a></>}
          </p>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            {listing && <Button asChild size="lg"><Link href={`/item/${listing.id}`}>Message the seller</Link></Button>}
            <Button asChild size="lg" variant="outline"><Link href="/">Keep browsing</Link></Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Payment reference {session.id.slice(-8).toUpperCase()}
            {!session.livemode && " · Test payment, no real money was charged"}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
