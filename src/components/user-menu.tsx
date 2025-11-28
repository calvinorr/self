"use client";

import { useState } from "react";
import Image from "next/image";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-elevated transition-colors"
      >
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
        <div className="flex flex-1 flex-col text-left">
          <span className="text-sm font-medium text-foreground truncate">
            {user.name || "User"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {user.email || "Personal Journal"}
          </span>
        </div>
        <span className="material-symbols-outlined text-lg text-muted-foreground">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-lg border border-border bg-surface shadow-lg overflow-hidden">
            <form
              action={async () => {
                const { signOut } = await import("@/auth");
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
