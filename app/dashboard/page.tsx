import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { MainDashboard } from "@/components/main-dashboard";
import { SubAgentsSidebar } from "@/components/sub-agents-sidebar";
import { NotificationCenter } from "@/components/notification-center";
import { ActionPanel } from "@/components/action-panel";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to sign-in
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SubAgentsSidebar />
      <div className="flex-1">
        <DashboardShell>
          <DashboardHeader 
            heading="CorpBuddy Dashboard" 
            text={`Welcome, ${session.user?.name || "User"}!`} 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <MainDashboard />
            </div>
            <div className="space-y-6">
              <NotificationCenter />
              <ActionPanel />
            </div>
          </div>
        </DashboardShell>
      </div>
    </div>
  );
} 