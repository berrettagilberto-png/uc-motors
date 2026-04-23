"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/veicoli", label: "Veicoli", icon: "🏍️" },
  { href: "/admin/prenotazioni", label: "Prenotazioni", icon: "📅" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <aside className="w-60 bg-[#111111] text-white shrink-0 hidden lg:flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-3xl font-black tracking-tighter">UC</span>
            <span className="text-sm font-bold italic text-[#E8000E] tracking-widest uppercase ml-1">
              motors
            </span>
          </Link>
          <p className="text-gray-500 text-xs mt-1.5 font-medium uppercase tracking-widest">
            Admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#E8000E] text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>🌐</span> Vai al sito
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>🚪</span> Esci
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${
                  active ? "text-[#E8000E]" : "text-gray-500"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60 pb-16 lg:pb-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-[#111111] tracking-tighter">
              UC
            </span>
            <span className="text-sm font-bold italic text-[#E8000E] tracking-widest uppercase ml-1">
              motors
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Esci
          </button>
        </header>

        <main className="flex-1 p-6 max-w-5xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
