"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "@/lib/supabase";

export function ItemDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Couldn’t load this listing.");
        setItem(j.listing);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSending(true);
    setMsgError(null);
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: id, buyer_email: fd.get("buyer_email"), message: fd.get("message") }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setSent(true);
      form.reset();
    } catch (err) {
      setMsgError(err instanceof Error ? err.message : "Couldn’t send your message.");
    } finally {
      setSending(false);
    }
  }

  const back = (
    <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
      <ArrowLeft className="size-4" />Back to Marketplace
    </Link>
  );

  if (loading) return <div>{back}<p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading…</p></div>;
  if (error || !item) return <div>{back}<p role="alert" className="text-destructive">{error ?? "Listing not found."}</p></div>;

  return (
    <div className="max-w-5xl">
      {back}
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {item.image_url && <img src={item.image_url} alt={item.title} className="size-full object-cover" />}
        </div>
        <Card>
          <CardContent className="space-y-3 p-4">
            <Badge>{item.category}</Badge>
            <h1 className="text-2xl font-extrabold">{item.title}</h1>
            <p className="text-2xl">{formatPrice(item.price)}</p>
            <p className="text-sm text-muted-foreground">{item.location} · Listed {new Date(item.created_at).toLocaleDateString()}</p>
            {item.description && <p className="whitespace-pre-line text-sm">{item.description}</p>}
            <Separator />
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold uppercase text-primary-foreground">
                {item.seller_email[0]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Seller</p>
                <a href={`mailto:${item.seller_email}`} className="block truncate text-sm text-primary hover:underline">{item.seller_email}</a>
              </div>
            </div>
            <Separator />
            {sent ? (
              <p role="status" className="flex items-start gap-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />Message sent. The seller will reply to your email.
              </p>
            ) : (
              <form onSubmit={send} className="space-y-3">
                <Input name="buyer_email" type="email" required placeholder="Your email" aria-label="Your email" />
                <Textarea name="message" required placeholder="Hi, is this still available?" aria-label="Message" />
                {msgError && <p role="alert" className="text-sm text-destructive">{msgError}</p>}
                <Button type="submit" size="lg" className="w-full" disabled={sending}>
                  {sending && <Loader2 className="size-4 animate-spin" />}{sending ? "Sending…" : "Message seller"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
