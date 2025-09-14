"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, AlertTriangle, CheckCircle, X } from "lucide-react"

interface Update {
  id: string
  type: "delay" | "arrival" | "departure" | "alert"
  title: string
  message: string
  timestamp: string
  busId?: string
  route?: string
  severity: "low" | "medium" | "high"
  read: boolean
}

// Mock real-time updates
const mockUpdates: Update[] = [
  {
    id: "1",
    type: "delay",
    title: "Bus Delayed",
    message: "BUS001 is running 5 minutes late due to traffic",
    timestamp: "2 minutes ago",
    busId: "BUS001",
    route: "City Center - Airport",
    severity: "medium",
    read: false,
  },
  {
    id: "2",
    type: "arrival",
    title: "Bus Arriving Soon",
    message: "BUS002 will arrive at University Campus in 3 minutes",
    timestamp: "5 minutes ago",
    busId: "BUS002",
    route: "Downtown - University",
    severity: "low",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Route Change",
    message: "Temporary route change for BUS003 due to road construction",
    timestamp: "10 minutes ago",
    busId: "BUS003",
    route: "Mall - Business District",
    severity: "high",
    read: true,
  },
]

export function RealTimeUpdates() {
  const [updates, setUpdates] = useState<Update[]>(mockUpdates)
  const [isVisible, setIsVisible] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new updates
      if (Math.random() > 0.7) {
        const newUpdate: Update = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? "arrival" : "delay",
          title: Math.random() > 0.5 ? "Bus Arriving" : "Minor Delay",
          message: `BUS00${Math.floor(Math.random() * 3) + 1} status update`,
          timestamp: "Just now",
          busId: `BUS00${Math.floor(Math.random() * 3) + 1}`,
          route: "Live Route",
          severity: "low",
          read: false,
        }

        setUpdates((prev) => [newUpdate, ...prev.slice(0, 9)]) // Keep only 10 updates
      }
    }, 15000) // Add new update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const unreadCount = updates.filter((update) => !update.read).length

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "arrival":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "departure":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const markAsRead = (id: string) => {
    setUpdates((prev) => prev.map((update) => (update.id === id ? { ...update, read: true } : update)))
  }

  const markAllAsRead = () => {
    setUpdates((prev) => prev.map((update) => ({ ...update, read: true })))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Notification Bell */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="relative bg-accent hover:bg-accent/90 rounded-full w-12 h-12 p-0 shadow-lg"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center p-0">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Updates Panel */}
      {isVisible && (
        <Card className="absolute bottom-16 right-0 w-80 max-h-96 overflow-hidden shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Live Updates</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Real-time bus status and notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {updates.length > 0 ? (
                updates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      !update.read ? "bg-accent/5" : ""
                    }`}
                    onClick={() => markAsRead(update.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getUpdateIcon(update.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{update.title}</h4>
                          <Badge variant={getSeverityColor(update.severity)} className="text-xs">
                            {update.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{update.message}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{update.timestamp}</span>
                          {update.busId && <span>{update.busId}</span>}
                        </div>
                      </div>
                      {!update.read && <div className="w-2 h-2 bg-accent rounded-full mt-1" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No updates available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
