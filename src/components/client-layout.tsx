"use client";

import { Sidebar } from "./sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function ClientLayout({ children, user }: ClientLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar user={user} />
      {children}
    </div>
  );
}
