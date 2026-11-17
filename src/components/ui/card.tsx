import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, ...p }: React.ComponentProps<"div">) =>
  <div className={cn("rounded-2xl border bg-card text-card-foreground shadow-sm", className)} {...p} />;
export const CardHeader = ({ className, ...p }: React.ComponentProps<"div">) =>
  <div className={cn("flex flex-col gap-1 p-4", className)} {...p} />;
export const CardTitle = ({ className, ...p }: React.ComponentProps<"h3">) =>
  <h3 className={cn("text-lg font-bold leading-tight", className)} {...p} />;
export const CardContent = ({ className, ...p }: React.ComponentProps<"div">) =>
  <div className={cn("p-4 pt-0", className)} {...p} />;
