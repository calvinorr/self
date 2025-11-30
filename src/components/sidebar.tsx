"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
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
  { href: "/growth", label: "Growth", icon: "trending_up" },
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

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Sidebar({ user: propUser }: SidebarProps = {}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Use prop user if provided (server component), otherwise use session (client component)
  const user = propUser ?? session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-3">
        <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
        <h1 className="text-lg font-bold text-foreground">MindScribe AI</h1>
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
        {user && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 border-t border-border pt-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {initials}
              </div>
            )}
            <div className="flex flex-1 flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {user.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
              title="Sign out"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
