import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = ({ className, ...p }: React.ComponentProps<"input">) => (
  <input className={cn("h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring", className)} {...p} />
);
