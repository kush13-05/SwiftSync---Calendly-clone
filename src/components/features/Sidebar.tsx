"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Users, LayoutGrid, Search } from "lucide-react";
import { Logo } from "../ui/Logo";

const NAV_ITEMS = [
  { label: "Event Types", href: "/event-types", icon: LayoutGrid },
  { label: "Availability", href: "/availability", icon: Clock },
  { label: "Meetings", href: "/meetings", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white/60 backdrop-blur-xl border-r border-white/20 flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      {/* Logo area */}
      <div className="px-7 py-7">
        <Link href="/event-types" className="flex items-center gap-3 group">
          <div className="w-10 h-10 transition-transform group-hover:scale-110 duration-300">
            <Logo />
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-xl tracking-tight">SwiftSync</span>
            <p className="text-[10px] uppercase tracking-widest text-[#006BFF] font-bold">Scheduling</p>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <div className="mb-4 px-3">
             <div className="relative group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={14} />
                <input 
                    placeholder="Search..." 
                    className="w-full bg-gray-100/50 border-transparent focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all rounded-lg pl-8 py-1.5 text-xs outline-none font-bold"
                />
             </div>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                isActive
                  ? "bg-white text-primary shadow-sm shadow-blue-100/50 translate-x-1"
                  : "text-gray-500 hover:bg-white/50 hover:text-gray-900 hover:translate-x-1"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-blue-50" : "bg-transparent group-hover:bg-gray-100"}`}>
                <Icon size={18} />
              </div>
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User area at bottom */}
      <div className="px-5 py-6 mt-auto border-t border-gray-100/50">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/40 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-100 transition-transform group-hover:scale-105">
            D
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">Demo User</p>
            <p className="text-[11px] text-gray-500 truncate">hello@swiftsync.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
