"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { Header } from "@/components/ui/header";

export function SellPanel() {
  return (
    <aside className="rounded-3xl bg-white p-5 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-96 md:shrink-0 md:overflow-y-auto">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Close and return to Marketplace"
          className="grid size-11 place-items-center rounded-full bg-black/10 hover:bg-black/15">
          <X className="size-5" />
        </Link>
        <Link href="/" aria-label="Marketplace home"
          className="grid size-11 place-items-center rounded-full bg-primary text-2xl font-extrabold text-white">F</Link>
      </div>
      <h1 className="mt-6 text-2xl font-extrabold">Create new listing</h1>
      <Header />
    </aside>
  );
}
