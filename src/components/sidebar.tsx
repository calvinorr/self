"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const mainNav: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "grid_view" },
  { href: "/entries", label: "All Entries", icon: "book_4" },
  { href: "/insights", label: "Insights", icon: "lightbulb" },
  { href: "/calendar", label: "Calendar", icon: "calendar_month" },
];

const bottomNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: "settings" },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
      )}
    >
      <span
        className="material-symbols-outlined text-[22px]"
        style={{
          fontVariationSettings: isActive
            ? "'FILL' 1, 'wght' 400"
            : "'FILL' 0, 'wght' 300",
        }}
      >
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="flex h-8 w-8 items-center justify-center text-primary">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground">MindScribe</h1>
      </div>

      {/* Main Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
        {/* New Entry Button */}
        <Link
          href="/entry/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>New Entry</span>
        </Link>

        {/* Bottom Nav */}
        <nav className="flex flex-col gap-1">
          {bottomNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
            />
          ))}
          <ThemeToggle />
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-muted-foreground">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">User</span>
            <span className="text-xs text-muted-foreground">Personal Journal</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
