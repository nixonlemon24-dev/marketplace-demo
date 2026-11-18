"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";

export function CheckoutBanner({ listingId, checkout, sessionId }: { listingId: string; checkout?: string; sessionId?: string }) {
  const [paid, setPaid] = useState<boolean | null>(null);

  useEffect(() => {
    if (checkout !== "success" || !sessionId) return;
    let alive = true;
    fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}&listing_id=${listingId}`)
      .then((r) => r.json())
      .then((j) => { if (alive) setPaid(Boolean(j.paid)); })
      .catch(() => { if (alive) setPaid(false); });
    return () => { alive = false; };
  }, [checkout, sessionId, listingId]);

  if (checkout === "cancelled") {
    return <p role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-card p-3 text-sm"><Info className="size-4 shrink-0" />Checkout cancelled. You have not been charged.</p>;
  }
  if (checkout !== "success" || !sessionId) return null;
  if (paid === null) return <p role="status" className="mb-4 rounded-xl bg-card p-3 text-sm">Confirming your payment...</p>;
  return paid ? (
    <p role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-card p-3 text-sm font-semibold text-primary">
      <CheckCircle2 className="size-4 shrink-0" />Payment received. Stripe will email you a receipt. Message the seller to arrange pickup or delivery.
    </p>
  ) : (
    <p role="alert" className="mb-4 rounded-xl bg-card p-3 text-sm text-destructive">We could not confirm that payment. If you were charged, check your Stripe receipt email.</p>
  );
}