"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/chats", label: "Conversations" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/settings", label: "Settings" },
];

export default function TopNav() {
  const path = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-wa-sidebar border-b border-wa-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-8 h-14">
        <div className="shrink-0">
          <span className="text-wa-green font-bold text-base">🎣 Gerald Bot</span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-wa-input text-wa-green font-medium"
                    : "text-wa-sub hover:text-wa-text hover:bg-wa-input/50"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          className="text-xs text-wa-sub hover:text-wa-text transition-colors shrink-0"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
