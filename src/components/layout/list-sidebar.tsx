"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tag, User } from "lucide-react";

export function ListSidebar() {
  const active = useSearchParams().get("category");
  const row = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5";
  const item = "block whitespace-nowrap rounded-lg px-3 py-1.5 text-sm hover:bg-black/5";

  return (
    <aside className="p-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto">
      <Link href="/" className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
        <span className="grid size-11 place-items-center rounded-full bg-primary text-2xl font-extrabold text-white">F</span>
        <span className="text-xl font-extrabold">Marketplace</span>
      </Link>
      <h2 className="mt-6 text-lg font-extrabold">Create new listing</h2>
      <nav aria-label="Seller" className="mt-2 flex flex-col">
        <Link href="/sell/mine" className={row}><Tag className="size-4" />Your listings</Link>
        <div aria-disabled="true" title="Coming soon" className={cn(row, "opacity-50 hover:bg-transparent")}>
          <User className="size-4" />Seller help
        </div>
      </nav>

    </aside>
  );
}
