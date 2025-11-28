import { auth } from "@/auth";
import { Sidebar } from "./sidebar";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex h-screen w-full">
      <Sidebar user={session?.user} />
      {children}
    </div>
  );
}
