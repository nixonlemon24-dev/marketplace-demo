import * as React from "react";
import { cn } from "@/lib/utils";

// native <select>: simpler and more reliable on mobile than the Radix popover version
export const Select = ({ className, ...p }: React.ComponentProps<"select">) => (
  <select className={cn("h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...p} />
);
