"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, FlaskConical, Users, Building2,
  MessageSquare, Settings, LogOut, ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin",            icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/publications",icon: FileText,        label: "Publications" },
  { href: "/admin/research",   icon: FlaskConical,     label: "Research" },
  { href: "/admin/fellows",    icon: Users,            label: "Fellows" },
  { href: "/admin/partnerships",icon: Building2,       label: "Partnerships" },
  { href: "/admin/inquiries",  icon: MessageSquare,    label: "Inquiries" },
  { href: "/admin/settings",   icon: Settings,         label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-deep border-r border-white/7">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/7">
        <Link href="/" className="flex items-center gap-2.5 group" target="_blank">
          <Image
            src="/logos/ecadel_labs_transparent_1600.png"
            alt="ECADEL LABS"
            width={36}
            height={36}
            className="opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <div>
            <div className="text-cream font-display font-bold text-sm tracking-wide leading-none">
              ECADEL <span className="text-gold">LABS</span>
            </div>
            <div className="text-platinum/45 text-[9px] tracking-[0.18em] uppercase font-mono mt-0.5">
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="text-[9px] tracking-[0.25em] uppercase text-muted font-mono mb-3 px-3">
          Content
        </div>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-sm transition-all duration-150 group ${
                    active
                      ? "bg-gold/10 text-gold border-l-2 border-gold pl-2.5"
                      : "text-platinum/68 hover:text-cream hover:bg-white/4 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className={active ? "text-gold" : "text-platinum/50 group-hover:text-cream"} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {active && <ChevronRight size={12} className="text-gold/60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/7">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted hover:text-ruby hover:bg-ruby/5 rounded-sm transition-all duration-150"
        >
          <LogOut size={14} />
          Sign out
        </button>
        <div className="mt-3 px-3">
          <Link
            href="/"
            target="_blank"
            className="text-[10px] text-platinum/38 hover:text-gold transition-colors duration-150 flex items-center gap-1"
          >
            ↗ View live site
          </Link>
        </div>
      </div>
    </aside>
  );
}
