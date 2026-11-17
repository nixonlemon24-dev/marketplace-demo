import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "@/lib/supabase";

export function ListingCard({ l }: { l: Listing }) {
  return (
    <Link href={`/item/${l.id}`} className="group block rounded-2xl transition-shadow hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {l.image_url && (
          <img src={l.image_url} alt={l.title} loading="lazy"
            className="size-full object-cover transition-transform duration-200 group-hover:scale-105" />
        )}
      </div>
      <p className="mt-2 text-lg font-bold">{formatPrice(l.price)}</p>
      <p className="truncate text-sm">{l.title}</p>
      <p className="truncate text-sm text-muted-foreground">{l.location}</p>
    </Link>
  );
}