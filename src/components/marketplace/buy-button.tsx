"use client";
import { useEffect, useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const MIN_CHARGE = 0.5;

export function BuyButton({ listingId, price }: { listingId: string; price: number | string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tooLow = Number(price) < MIN_CHARGE;

  useEffect(() => {
    const reset = (e: PageTransitionEvent) => { if (e.persisted) setBusy(false); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.error ?? "Couldn't start checkout.");
      window.location.assign(j.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" size="lg" className="w-full" onClick={buy} disabled={busy || tooLow}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <ShoppingCart className="size-4" />}
        {busy ? "Redirecting to Stripe..." : `Buy now · ${formatPrice(price)}`}
      </Button>
      {tooLow && <p className="text-sm text-muted-foreground">Items under $0.50 cannot be bought online. Message the seller instead.</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}