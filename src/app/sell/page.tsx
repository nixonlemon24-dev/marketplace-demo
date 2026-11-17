import Link from "next/link";
import { Car, Home, Layers, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = [
  { Icon: Package, title: "Item for sale", desc: "Sell something you own, with a photo and a price.", href: "/sell/item" },
  { Icon: Layers, title: "Create multiple listings", desc: "Add several items in one go.", href: null },
  { Icon: Car, title: "Vehicle for sale", desc: "Cars, bikes and anything with an engine.", href: "/sell/item?category=Vehicles" },
  { Icon: Home, title: "Home for sale or rent", desc: "Houses, apartments and rooms.", href: "/sell/item?category=Home%20Sales" },
];

export default function ChooseType() {
  return (
    <div className="md:pt-24">
      <h2 className="text-3xl font-extrabold">Choose listing type</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TYPES.map(({ Icon, title, desc, href }) => {
          const body = (
            <>
              <span className="grid size-14 place-items-center rounded-full bg-black/5"><Icon className="size-6" /></span>
              <span className="mt-4 text-center font-bold">{title}</span>
              <span className="mt-1 text-center text-sm text-muted-foreground">{href ? desc : "Coming soon"}</span>
            </>
          );
          const card = "flex h-full min-h-48 flex-col items-center rounded-3xl bg-white p-6";
          return (
            <li key={title}>
              {href ? (
                <Link href={href} className={cn(card, "transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring")}>{body}</Link>
              ) : (
                <div className={cn(card, "opacity-60")} aria-disabled="true">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
