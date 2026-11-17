import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = ({ className, ...p }: React.ComponentProps<"textarea">) => (
  <textarea className={cn("min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring", className)} {...p} />
);
