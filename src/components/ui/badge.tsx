import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: { variant: { default: "bg-primary/10 text-primary", secondary: "bg-secondary text-secondary-foreground", outline: "border" } },
  defaultVariants: { variant: "default" },
});
export const Badge = ({ className, variant, ...p }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) =>
  <span className={cn(badgeVariants({ variant }), className)} {...p} />;
