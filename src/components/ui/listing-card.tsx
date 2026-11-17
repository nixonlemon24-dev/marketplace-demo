import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "@/lib/supabase";

export function ListingCard({ l }: { l: Listing }) {
  return (
    <Link href={`/listing/${l.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/10">
        {l.image_url && (
          <Image src={l.image_url} alt={l.title} fill sizes="(min-width:1536px) 18vw, (min-width:1024px) 22vw, 45vw" className="object-cover" />
        )}
      </div>
      <p className="mt-2 text-lg font-bold">{formatPrice(l.price)}</p>
      <p className="truncate text-sm group-hover:underline">{l.title}</p>
      <p className="truncate text-sm text-muted-foreground">{l.location}</p>
    </Link>
  );
}
