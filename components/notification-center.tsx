"use client"

import { useState } from "react"
import { Bell, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  priority: "high" | "medium" | "low"
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Invoice #1234 is due",
    description: "Invoice for Client XYZ is due in 3 days",
    time: "2 hours ago",
    priority: "high",
    read: false,
  },
  {
    id: "2",
    title: "New client inquiry",
    description: "ABC Corp has requested a proposal",
    time: "5 hours ago",
    priority: "medium",
    read: false,
  },
  {
    id: "3",
    title: "Expense approval needed",
    description: "John requested approval for $1,200 expense",
    time: "Yesterday",
    priority: "medium",
    read: false,
  },
  {
    id: "4",
    title: "Tax filing reminder",
    description: "Quarterly taxes due in 2 weeks",
    time: "2 days ago",
    priority: "high",
    read: false,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <CardDescription>Stay updated on important tasks</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {unreadCount} new
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 rounded-md border p-3 ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <Bell
                    className={`h-5 w-5 ${
                      notification.priority === "high"
                        ? "text-destructive"
                        : notification.priority === "medium"
                          ? "text-amber-500"
                          : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)} className="h-7 w-7">
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissNotification(notification.id)}
                      className="h-7 w-7"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

