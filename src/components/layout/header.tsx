"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, Mail, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICONS = [
  { Icon: Mail, label: "Messages" },
  { Icon: Bell, label: "Notifications" },
  { Icon: User, label: "Account" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const q = useSearchParams().get("q") ?? "";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    const base = pathname.startsWith("/category/") ? pathname : "/";
    router.push(v ? `${base}?q=${encodeURIComponent(v)}` : base);
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card px-4">
      <Link href="/" aria-label="Marketplace home" className="flex shrink-0 items-center gap-2">
        <span className="grid size-10 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">F</span>
        <span className="hidden text-xl font-extrabold sm:inline">Marketplace</span>
      </Link>
      <form onSubmit={onSubmit} role="search" className="relative min-w-0 flex-1 sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input key={q} name="q" type="search" defaultValue={q} placeholder="Search Marketplace" aria-label="Search Marketplace"
          className="h-10 w-full rounded-full bg-background pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </form>
      <div className="ml-auto flex shrink-0 gap-1">
        {ICONS.map(({ Icon, label }) => (
          <Button key={label} type="button" variant="ghost" size="icon" aria-label={label} className="text-muted-foreground">
            <Icon className="size-5" />
          </Button>
        ))}
      </div>
    </header>
  );
}
