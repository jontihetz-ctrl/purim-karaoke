"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/chats", label: "Conversations", icon: "💬" },
  { href: "/intelligence", label: "Intelligence", icon: "🛡️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function NavSidebar() {
  const path = usePathname();
  return (
    <nav className="w-56 bg-wa-sidebar flex flex-col p-4 gap-1 border-r border-wa-border shrink-0">
      <div className="mb-6 px-3">
        <h1 className="text-lg font-bold text-wa-green">🎣 Gerald Bot</h1>
        <p className="text-xs text-wa-sub mt-0.5">Scambait Manager</p>
      </div>
      {links.map((l) => {
        const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={`nav-link ${active ? "active" : ""}`}>
            <span>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
      <div className="mt-auto px-3">
        <form action="/api/logout" method="post">
          <button className="text-xs text-wa-sub hover:text-wa-text w-full text-left py-2">
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
