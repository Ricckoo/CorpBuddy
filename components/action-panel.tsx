"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RecommendedAction {
  id: string
  title: string
  description: string
  justification: string
  impact: "high" | "medium" | "low"
  status: "pending" | "approved" | "rejected"
}

const initialActions: RecommendedAction[] = [
  {
    id: "1",
    title: "Pay Invoice #5678",
    description: "Supplier ABC has an invoice due in 2 days. Recommend payment processing today.",
    justification: "Early payment qualifies for a 2% discount, saving $240.",
    impact: "medium",
    status: "pending",
  },
  {
    id: "2",
    title: "Follow up with Client XYZ",
    description: "Client XYZ has an overdue invoice of $12,500. Recommend sending a reminder.",
    justification: "Invoice is 15 days overdue and affects cash flow projections.",
    impact: "high",
    status: "pending",
  },
]

export function ActionPanel() {
  const [actions, setActions] = useState<RecommendedAction[]>(initialActions)
  const [actionHistory, setActionHistory] = useState<RecommendedAction[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const approveAction = (id: string) => {
    const actionToUpdate = actions.find((action) => action.id === id)
    if (actionToUpdate) {
      const updatedAction = { ...actionToUpdate, status: "approved" as const }
      setActionHistory([updatedAction, ...actionHistory])
      setActions(actions.filter((action) => action.id !== id))
    }
  }

  const rejectAction = (id: string) => {
    const actionToUpdate = actions.find((action) => action.id === id)
    if (actionToUpdate) {
      const updatedAction = { ...actionToUpdate, status: "rejected" as const }
      setActionHistory([updatedAction, ...actionHistory])
      setActions(actions.filter((action) => action.id !== id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recommended Actions</CardTitle>
        <CardDescription>Actions that require your attention</CardDescription>
      </CardHeader>
      <CardContent>
        {!showHistory ? (
          actions.length > 0 ? (
            <div className="space-y-4">
              {actions.map((action) => (
                <Alert
                  key={action.id}
                  variant={
                    action.impact === "high" ? "destructive" : action.impact === "medium" ? "default" : "outline"
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{action.title}</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>{action.description}</p>
                    <p className="text-sm font-medium">Justification: {action.justification}</p>
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" onClick={() => approveAction(action.id)}>
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => rejectAction(action.id)}>
                        Reject
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">No pending actions</p>
            </div>
          )
        ) : actionHistory.length > 0 ? (
          <div className="space-y-4">
            {actionHistory.map((action) => (
              <div key={action.id} className="flex items-start space-x-4 rounded-md border p-3">
                {action.status === "approved" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <p className="text-xs font-medium">
                    Status: {action.status === "approved" ? "Approved" : "Rejected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No action history</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="w-full">
          {showHistory ? "Show Pending Actions" : "Show Action History"}
        </Button>
      </CardFooter>
    </Card>
  )
}

