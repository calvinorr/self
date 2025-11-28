import { auth } from "@/auth";
import { SidebarClient } from "./sidebar-client";

export async function Sidebar() {
  const session = await auth();

  return <SidebarClient user={session?.user} />;
}
