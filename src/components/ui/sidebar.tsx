"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tag, User } from "lucide-react";

export function Sidebar() {
  const active = useSearchParams().get("category");
  const row = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5";
  const item = "block whitespace-nowrap rounded-lg px-3 py-1.5 text-sm hover:bg-black/5";

  const CATEGORIES = [  "Vehicles", "Property Rentals", "Apparel", "Classifieds", "Electronics", "Entertainment",
  "Family", "Free Stuff", "Garden & Outdoor", "Hobbies", "Home Goods", "Home Improvement",
  "Home Sales", "Musical Instruments", "Office Supplies", "Pet Supplies", "Sporting Goods",
  "Toys & Games", "Buy and sell groups",];
  
  return (
    <aside className="p-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto">
      <Link href="/" className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
        <span className="grid size-11 place-items-center rounded-full bg-primary text-2xl font-extrabold text-white">F</span>
        <span className="text-xl font-extrabold">Marketplace</span>
      </Link>
      <h2 className="mt-6 text-lg font-extrabold">Create new listing</h2>
      <nav aria-label="Seller" className="mt-2 flex flex-col">
        <Link href="/sell" className={row}><Tag className="size-4" />Choose listing type</Link>
        <Link href="/sell/mine" className={row}><Tag className="size-4" />Your listings</Link>
        <div aria-disabled="true" title="Coming soon" className={cn(row, "opacity-50 hover:bg-transparent")}>
          <User className="size-4" />Seller help
        </div>
      </nav>
      <h2 className="mb-2 mt-6 font-bold">Categories</h2>
      <nav aria-label="Categories">
        <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0.5 md:pb-0">
          <li><Link href="/" className={cn(item, !active && "bg-primary/10 font-semibold text-primary")}>All listings</Link></li>
          {CATEGORIES.map((c) => (
            <li key={c}>
              <Link href={`/?category=${encodeURIComponent(c)}`}
                className={cn(item, active === c && "bg-primary/10 font-semibold text-primary")}>{c}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
