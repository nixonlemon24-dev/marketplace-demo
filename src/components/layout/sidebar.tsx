"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tag } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const item = "block whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-black/5";
  const on = "bg-primary/10 font-semibold text-primary";
  return (
    <aside className="p-4 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-64 md:shrink-0 md:overflow-y-auto">
      <h2 className="text-lg font-extrabold">Create new listing</h2>
      <Link href="/create" className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5">
        <Tag className="size-4" />Choose listing type
      </Link>
      <h2 className="mb-2 mt-6 font-bold">Categories</h2>
      <nav aria-label="Categories">
        <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-0.5 md:pb-0">
          <li><Link href="/" className={cn(item, pathname === "/" && on)}>All listings</Link></li>
          {CATEGORY_LIST.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className={cn(item, pathname === `/category/${c.slug}` && on)}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
