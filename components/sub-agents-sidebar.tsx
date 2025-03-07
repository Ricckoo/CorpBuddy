"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Users, FileText, Mail, Calendar, Settings, Menu, CreditCard, LayoutDashboard, PieChart, MessageSquare, Briefcase, Link as LinkIcon } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "transparent"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export function SubAgentsSidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const mainItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <PieChart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
  ]

  const agentItems = [
    {
      title: "CFO Agent",
      href: "/agents/cfo",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "HR Agent",
      href: "/agents/hr",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Legal Agent",
      href: "/agents/legal",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
    },
  ]

  const integrationItems = [
    {
      title: "Plaid",
      href: "/integrations/plaid",
      icon: <LinkIcon className="mr-2 h-4 w-4" />,
    },
  ]

  const otherItems = [
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <div className="pb-12 w-64 border-r min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            CorpBuddy
          </h2>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <SidebarNav items={mainItems} />
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Agents
          </h2>
          <SidebarNav items={agentItems} />
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Integrations
          </h2>
          <SidebarNav items={integrationItems} />
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <SidebarNav items={otherItems} />
        </div>
      </div>
    </div>
  )
}

