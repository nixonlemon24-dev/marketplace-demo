import { Bell, Mail, User } from "lucide-react";
// import { SellPanel } from "@/components/sell-panel";

const icons = [
  { Icon: Mail, label: "Messages" },
  { Icon: Bell, label: "Notifications" },
  { Icon: User, label: "Account" },
];

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] p-4 md:flex md:gap-4">
      {/* <SellPanel /> */}
      <div className="min-w-0 flex-1">
        <header className="flex justify-end gap-2 py-4 md:px-4">
          {icons.map(({ Icon, label }) => (
            <button key={label} type="button" aria-label={label}
              className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-black/5">
              <Icon className="size-6" />
            </button>
          ))}
        </header>
        <main className="max-w-5xl py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
