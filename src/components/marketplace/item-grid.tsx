"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "@/lib/supabase";

export function ItemGrid({ category, title = "Today's picks" }: { category?: string; title?: string }) {
  const q = useSearchParams().get("q") ?? "";
  const key = `${category ?? ""}|${q}`;
  const [result, setResult] = useState<{ key: string; items: Listing[]; error: string | null } | null>(null);
  // a result for a different category or search means the current one is still loading
  const current = result?.key === key ? result : null;
  const loading = !current;
  const items = current?.items ?? [];
  const error = current?.error ?? null;

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    fetch(`/api/listings?${params}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Couldn't load listings.");
        setResult({ key, items: j.listings, error: null });
      })
      .catch((e) => { if (e.name !== "AbortError") setResult({ key, items: [], error: e.message }); });
    return () => ctrl.abort();
  }, [category, q, key]);

  return (
    <section>
      <h1 className="text-2xl font-extrabold">{q ? `Results for "${q}"` : title}</h1>
      {loading && <p className="mt-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading listings...</p>}
      {error && <p role="alert" className="mt-10 text-destructive">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <div className="mt-10 flex flex-col items-start gap-3 text-muted-foreground">
          <PackageOpen className="size-10" />
          <p>{q || category ? "Nothing matches yet." : "No listings yet."}</p>
          <Button asChild><Link href="/create/item">Create the first listing</Link></Button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((l) => (
          <Link key={l.id} href={`/item/${l.id}`} className="group block rounded-2xl transition-shadow hover:shadow-md">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {l.image_url && <img src={l.image_url} alt={l.title} loading="lazy" className="size-full object-cover transition-transform duration-200 group-hover:scale-105" />}
            </div>
            <p className="mt-2 text-lg font-bold">{formatPrice(l.price)}</p>
            <p className="truncate text-sm">{l.title}</p>
            <p className="truncate text-sm text-muted-foreground">{l.location}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}