import { Sidebar } from "@/components/layout/sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4">{children}</main>
    </div>
  );
}
