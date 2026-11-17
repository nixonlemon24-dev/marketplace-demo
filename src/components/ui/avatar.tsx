"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export const Avatar = ({ className, ...p }: React.ComponentProps<typeof AvatarPrimitive.Root>) =>
  <AvatarPrimitive.Root className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)} {...p} />;
export const AvatarFallback = ({ className, ...p }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) =>
  <AvatarPrimitive.Fallback className={cn("flex size-full items-center justify-center bg-primary text-sm font-bold uppercase text-primary-foreground", className)} {...p} />;
