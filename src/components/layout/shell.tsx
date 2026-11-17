import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <Suspense><Sidebar /></Suspense>
      <main className="min-w-0 flex-1 p-4">{children}</main>
    </div>
  );
}