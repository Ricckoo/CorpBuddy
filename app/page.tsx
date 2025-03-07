import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { MainDashboard } from "@/components/main-dashboard"
import { SubAgentsSidebar } from "@/components/sub-agents-sidebar"
import { NotificationCenter } from "@/components/notification-center"
import { ActionPanel } from "@/components/action-panel"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }
  // If not authenticated, redirect to sign-in
  else {
    redirect("/auth/signin");
  }

  // This will never be rendered, but is needed for TypeScript
  return null;
}

