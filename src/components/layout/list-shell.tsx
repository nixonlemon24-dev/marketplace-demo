import { ListSidebar } from "@/components/layout/list-sidebar";

export function ListShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <ListSidebar />
      <main className="min-w-0 flex-1 p-4">{children}</main>
    </div>
  );
}
