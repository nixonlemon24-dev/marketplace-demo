"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = [
  { label: "Item for sale", href: "/sell/item" },
  { label: "Vehicle for sale", href: "/sell/item?category=Vehicles" },
  { label: "Home for sale or rent", href: "/sell/item?category=Home%20Sales" },
];

const circle = "grid size-12 shrink-0 place-items-center rounded-full bg-black/5";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      {pathname.startsWith("/sell") ? (
        <div className="relative mt-4">
          <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <select aria-label="Choose listing type" defaultValue=""
            onChange={(e) => e.target.value && router.push(e.target.value)}
            className="h-11 w-full rounded-lg bg-black/5 pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="" disabled>Choose listing type</option>
            {TYPES.map((t) => <option key={t.href} value={t.href}>{t.label}</option>)}
          </select>
        </div>
      ) : (
        // outside /sell, the field opens the listing-type screen
        <Link href="/sell"
          className="mt-4 flex h-11 w-full items-center gap-3 rounded-lg bg-black/5 px-3 text-sm hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-ring">
          <Tag className="size-4 text-muted-foreground" />
          <span className="flex-1">Choose listing type</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Link>
      )}
      <nav aria-label="Seller" className="mt-6 space-y-1">
        <Link href="/sell/mine"
          className={cn("flex items-center gap-4 rounded-xl p-2 font-bold hover:bg-black/5", pathname.startsWith("/sell/mine") && "bg-primary/10 text-primary")}>
          <span className={circle}><Tag className="size-5" /></span>Your listings
        </Link>
        <div className="flex items-center gap-4 rounded-xl p-2 font-bold opacity-50" aria-disabled="true">
          <span className={circle}><User className="size-5" /></span>
          <span>Seller help<span className="block text-xs font-normal text-muted-foreground">Coming soon</span></span>
        </div>
      </nav>
    </>
  );
}
